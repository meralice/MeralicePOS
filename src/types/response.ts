import { Offer, OfferCategory, OfferCategoryTranslation, OpeningHourSharedModel, OfferTranslation } from "./experience";

export interface CategoriesResponse {
  offerCategories: OfferCategory[];
  offerCategoryTranslations: OfferCategoryTranslation[];
}
export interface ExperiencesByCategoryResponse {
  offers: Offer[];
  openingHours: OpeningHourSharedModel[];
  offerTranslations: OfferTranslation[];
  offerCategoryTranslations: OfferCategoryTranslation[];
  offerCategories: OfferCategory[];
}
