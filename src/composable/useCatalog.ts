import { useCatalogStore } from "src/stores/catalog";
import { useFacilityStore } from "src/stores/facility";
import {
  getCategories,
  getSubCategories,
} from "src/services/experience/getCategories";
import { getExperiencesForAllCategories } from "src/services/experience/getExperiences";
import { flattenCategories } from "src/utils/category-helpers";
import { errorToast } from "src/utils/toast";
import { parseISO } from "date-fns";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export function useCatalog() {
  const isLoading = ref(false);
  const catalogStore = useCatalogStore();
  const facilityStore = useFacilityStore();
  const { t } = useI18n();

  async function fetchCatalog(): Promise<void> {
    try {
      const propertyCODE = facilityStore.activeCODE;

      // await new Promise((x) => setTimeout(x, 60000));
      // the catalog cannot be loaded without active property code
      if (!propertyCODE) return;

      // if catalog for current property was already loaded, do not fetch it again
      if (catalogStore.items.length) return;

      // get category hierarchy
      isLoading.value = true;
      const categories = await fetchCategories(propertyCODE);

      // flatten all categories
      const flattenedCategories = flattenCategories(categories);

      const experiencesByCategory = await getExperiencesForAllCategories(
        propertyCODE,
        flattenedCategories.map((x) => x.offerCategoryID),
        catalogStore.startDate,
        catalogStore.endDate
      );
      // keep catalog as a flat array
      const catalogItems = mapToCatalog(
        experiencesByCategory,
        flattenedCategories
      );
      // remove empty categories
      const catalogCategories = removeEmptyCategories(categories, catalogItems);

      // assign to store
      catalogStore.items = catalogItems;
      catalogStore.categoryHierarchy = catalogCategories;

      // if there's no active category filter yet, set first category as a filter
      // TODO: we can apply default category if flag is present!
      if (!catalogStore.categoryFilters.length && catalogItems.length) {
        catalogStore.categoryFilters = [catalogItems[0].offerCategoryID];
      }
      isLoading.value = false;
    } catch (e) {
      // set flag to avoid another loading and error in every view
      isLoading.value = false;
      catalogStore.hasLoaded = true;
      await errorToast({
        message: t("Failed to load catalog"),
      });
      throw e;
    }
  }

  async function fetchCategories(propertyCODE: string): Promise<Category[]> {
    const categories = mapToCategories(await getCategories(propertyCODE));
    await composeSubCategories(propertyCODE, categories);
    return categories;
  }

  async function composeSubCategories(
    propertyCODE: string,
    categories: Category[]
  ) {
    const parentCategories = categories.filter((x) => x.hasCategoryChild);
    if (!parentCategories.length) {
      return;
    }

    const tasks = parentCategories.map((cat) =>
      getSubCategories(propertyCODE, cat.offerCategoryID)
    );

    const data = await Promise.all(tasks);
    for (let i = 0; i < data.length; i++) {
      const originalCategory = categories.find(
        (x) => x.offerCategoryID === parentCategories[i].offerCategoryID
      );
      if (originalCategory) {
        originalCategory.subCategories = mapToCategories(data[i]);
        await composeSubCategories(
          propertyCODE,
          originalCategory.subCategories
        );
      }
    }
  }

  function mapToCatalog(
    experiencesByCategory: [number, ExperiencesByCategoryResponse][],
    flattenedCategories: Category[]
  ): CategoryExperiences[] {
    return experiencesByCategory
      .filter((x) => x[1].offers.length)
      .map((x) => {
        const categoryID = x[0];

        const category = flattenedCategories.find(
          (c) => c.offerCategoryID === categoryID
        );
        if (category === undefined) {
          throw new Error("Offer category lookup failed");
        }

        // same problem as https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
        // TODO: fetch does not automatically create dates, but strings
        // check how to get dates directly from API services!
        x[1].openingHours = x[1].openingHours.map((h) => {
          if (h.date && !(h.date instanceof Date)) {
            h.date = parseISO(h.date as unknown as string);
          }
          return h;
        });

        const catalogItem: CategoryExperiences = {
          ...category,
          items: x[1].offers.map((o: Offer): OfferDetail => {
            return {
              ...o,
              openingHours: x[1].openingHours
                .filter((x) => x.offerID === o.offerID)
                .sort(
                  (a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0)
                ),
              translations: x[1].offerTranslations.filter(
                (x) => x.offerID === o.offerID
              ),
            };
          }),
        };
        return catalogItem;
      });
  }

  function mapToCategories(categories: CategoriesResponse): Category[] {
    return categories.offerCategories.map((x): Category => {
      return {
        ...x,
        translations: categories.offerCategoryTranslations.filter(
          (c) => c.offerCategoryID === x.offerCategoryID
        ),
      };
    });
  }

  function removeEmptyCategories(
    categories: Category[],
    catalog: CategoryExperiences[]
  ): Category[] {
    categories = categories.filter((x) => hasActiveItems(x, catalog));
    categories
      .filter((x) => x.subCategories?.length)
      .forEach(
        (x) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (x.subCategories = removeEmptyCategories(x.subCategories!, catalog))
      );

    return categories;
  }

  function hasActiveItems(
    category: Category,
    catalog: CategoryExperiences[]
  ): boolean {
    return (
      catalog.some((x) => x.offerCategoryID === category.offerCategoryID) ||
      (category.subCategories?.some((sc) => hasActiveItems(sc, catalog)) ??
        false)
    );
  }

  return {
    fetchCatalog,
    isLoading,
  };
}
