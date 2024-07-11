import { request } from "../index";
import { CategoriesResponse } from "../../types/response";


export function getCategories(
  propertyCODE: string
): Promise<CategoriesResponse> {
  return request.get<CategoriesResponse>(`/experience/${propertyCODE}`);
}

export function getSubCategories(
  propertyCODE: string,
  categoryID: number
): Promise<CategoriesResponse> {
  return request.get<CategoriesResponse>(
    `/experience/${propertyCODE}/category/${categoryID}`
  );
}
