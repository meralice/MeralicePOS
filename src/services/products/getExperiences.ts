import { request } from "../index";
import { addMinutes, subMinutes } from "date-fns";

export function getExperiencesByCategory(
  propertyCODE: string,
  offerCategoryID: number,
  startDate?: Date,
  endDate?: Date
): Promise<ExperiencesByCategoryResponse> {
  const params = {
    ...(startDate && { startDate: formatTimezone(startDate).toISOString() }),
    ...(endDate && { endDate: formatTimezone(endDate).toISOString() }),
  };
  return request.get<ExperiencesByCategoryResponse>(
    `/experience/bycategory/${propertyCODE}/${offerCategoryID}`,
    { params }
  );
}

function formatTimezone(date: Date): Date {
  const offset = date.getTimezoneOffset();

  return Math.sign(offset) !== -1
    ? addMinutes(date, Math.abs(offset))
    : subMinutes(date, offset);
}

export async function getExperiencesForAllCategories(
  propertyCODE: string,
  offerCategoryIDs: number[],
  startDate?: Date,
  endDate?: Date
): Promise<[number, ExperiencesByCategoryResponse][]> {
  const tasks = offerCategoryIDs.map((id) =>
    getExperiencesByCategory(propertyCODE, id, startDate, endDate)
  );

  const data = await Promise.all(tasks);

  return offerCategoryIDs.map((id, i) => [id, data[i]]);
}
