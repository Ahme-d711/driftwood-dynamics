export interface CategoryFormState {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  priority: number;
  isShow: boolean;
}

export const defaultCategoryFormState: CategoryFormState = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  priority: 0,
  isShow: true,
};
