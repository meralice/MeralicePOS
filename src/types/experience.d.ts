export interface Offer {
  serviceID?: number;
  offerID: number;
  offerName?: string; // TODO: check if is present
  offerCategoryID: number;
  offerCategoryName?: string;
  offerCODE?: string;
  minDuration?: string;
  minDurationHours?: number;
  minDurationMinutes?: number;
  maxDuration?: string;
  maxDurationHours?: number;
  isAllPeriod?: boolean;
  maxDurationMinutes?: number;
  serviceLocation?: string;
  meetingLocation?: string;
  isDifferentMeetingPoint?: boolean;
  isTransactive?: boolean;
  isInformative?: boolean;
  multimedia?: OfferMultimediaModel[];
  rates?: Rate[];
}

/**
 * Extended offer containing all detailed information
 * mapped from all relations from API.
 */
declare interface OfferDetail extends Offer {
  openingHours: OpeningHourSharedModel[];
  translations: OfferTranslation[];
}

declare interface DayOffers {
  day?: Date;
  offers: OfferDetail[];
}

declare interface OfferCategoryBase {
  offerCategoryID: number;
  offerCategoryName: string;
  offerCategoryCODE: string;
  offerID: number;
}

export interface OfferCategory extends OfferCategoryBase {
  offerCategoryCommercialName: string;
  offerCategoryImageUrl: string;
  hasCategoryChild: boolean;
}

/**
 * Extended category containing category translation
 * with a fully composed category hierarchy.
 */
declare interface Category extends OfferCategory {
  translations: OfferCategoryTranslation[];
  subCategories?: Category[];
}

/**
 * Extended category containing category translation
 * and a list of catalog item details.
 */
declare interface CategoryExperiences extends Category {
  items: OfferDetail[];
}

export interface OfferCategoryTranslation {
  languageID: number;
  offerCategoryID: number;
  offerCategoryCommercialName: string;
}

export interface OfferTranslation {
  offerName: string;
  offerShortDescription: string;
  offerLongDescription: string;
  howToOrder: string;
  whoCanOrder: string;
  howToUse: string;
  languageID: number;
  offerID: number;
}

export interface OpeningHourSharedModel {
  offerID?: number;
  date?: Date;
  dayName?: string;
  isAllPeriod?: boolean;
  isOpened?: boolean;
  openingHoursString?: string;
  openingHours?: OpeningHour[];
}

declare interface OpeningHour {
  startTime?: string;
  endTime?: string;
}

declare interface OpeningHourDate {
  startDateTime: Date;
  endDateTime: Date;
}

declare interface OfferMultimediaModel {
  offerID?: number;
  multimediaID?: number;
  multimediaUrl?: string;
  multimediaTypeID?: number;
  filePath?: string;
  fileName?: string;
}

declare interface Rate {
  rateID?: number;
  name?: string;
  pricePerUnit?: number;
  hasDefault?: boolean;
  unitOfMeasureName?: string;
}
