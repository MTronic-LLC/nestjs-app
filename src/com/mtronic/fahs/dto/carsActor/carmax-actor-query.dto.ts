export interface CarMaxActorQueryDto {
    selectedFacets:            SelectedFacet[];
    expandedSearches:          ExpandedSearch[];
    selectedNofinements:       any[];
    searchByKeyword:           null;
    replacedKeyWord:           null;
    items:                     Item[];
    recommendedRefinements:    any[];
    filterCategories:          FilterCategory[];
    searchModerations:         null;
    sort:                      string;
    totalCount:                number;
    confidence:                number;
    seo:                       SEO;
    requestedUrl:              null;
    searchFailed:              boolean;
    location:                  Location;
    radius:                    string;
    radiusChanged:             boolean;
    shipping:                  string;
    includesFinanceDecisions:  null;
    minConditionAmount:        null;
    fbsApplication:            null;
    searchToken:               string;
    includesSavedCars:         boolean;
    facetSearchType:           string;
    facetSearchInterpretation: string;
    pivotTilesApply:           boolean;
    smallBatchDecisions:       null;
    take:                      number;
    hasSearchError:            boolean;
    canUseFbs:                 boolean;
    popularCars:               any[];
    transferEtas:              any[];
}

export interface ExpandedSearch {
    description: string;
    searchToken: string;
    totalCount:  number;
    category:    string;
    priority:    number;
}

export interface FilterCategory {
    name:               string;
    displayName:        string;
    displayOrder:       number;
    type:               string;
    searchCategoryName: string;
    data:               Datum[] | boolean | DataClass | null;
}

export interface Datum {
    name?:                      string;
    displayName?:               string;
    isSelected:                 boolean;
    value?:                     string;
    count?:                     number;
    isExcluded?:                boolean;
    isNonDefaultFacetForValue?: boolean;
    urlSegment?:                string;
    parents?:                   Parent[] | null;
}

export interface Parent {
    category: Category;
    value:    string;
}

export enum Category {
    Make = "Make",
    Model = "Model",
}

export interface DataClass {
    distanceFilters?:     DistanceFilter[];
    stores?:              Stores;
    minimumValue?:        number;
    maximumValue?:        number;
    increment?:           number;
    selectedMinimum?:     number | null;
    selectedMaximum?:     number | null;
    rangeSelectionType?:  number;
    display?:             number;
    minimumDisplayValue?: number;
    maximumDisplayValue?: number;
    increments?:          Increment[];
    name?:                string;
    displayName?:         string;
    displayOrder?:        number;
    filterSection?:       null;
}

export interface DistanceFilter {
    name:         string;
    displayName:  string;
    displayOrder: number;
    type:         number;
    values:       Value[];
    selectedDate: null;
}

export interface Value {
    value:        number | null;
    displayValue: string;
    isSelected:   boolean;
}

export interface Increment {
    minimum: number;
    maximum: number;
    count:   number;
}

export interface Stores {
    nearbyStores: Store[];
    allStores:    Store[];
}

export interface Store {
    value:                     string;
    count:                     number;
    isSelected:                boolean;
    isExcluded:                boolean;
    isNonDefaultFacetForValue: boolean;
    urlSegments:               string;
    name:                      string;
    distance:                  number;
    city:                      string;
    state:                     string;
    stateAbbreviation:         string;
}

export interface Item {
    stockNumber:                        number;
    vin:                                string;
    year:                               number;
    make:                               string;
    model:                              string;
    body:                               string;
    trim:                               string;
    basePrice:                          number;
    originalPrice:                      number | null;
    hasPriceDrop:                       boolean;
    mileage:                            number;
    storeId:                            number;
    storeName:                          string;
    storeCity:                          string;
    state:                              string;
    stateAbbreviation:                  string;
    distance:                           number;
    averageRating:                      number;
    numberOfReviews:                    number;
    repairPalData:                      null;
    isNewArrival:                       boolean;
    isTransferable:                     boolean;
    features:                           string[];
    highlightedFeatures:                string;
    highlights:                         string[];
    lastMadeSaleableDate:               Date;
    transferFee:                        null;
    transferTags:                       string[];
    transferText:                       string;
    transferType:                       string;
    minEstimatedTransferDurationInDays: null;
    maxEstimatedTransferDurationInDays: null;
    transferTimesUnavailable:           boolean;
    exteriorColor:                      string;
    interiorColor:                      string;
    normalizedExteriorColor:            null;
    normalizedInteriorColor:            null;
    transmission:                       string;
    review:                             null;
    numberOfFavorites:                  number;
    isSaleable:                         boolean;
    isComingSoon:                       boolean;
    isReserved:                         boolean;
    mpgCity:                            number;
    mpgHighway:                         number;
    originalBatteryRangeInMiles:        null;
    cylinders:                          number;
    driveTrain:                         string;
    engineType:                         string;
    fuelType:                           null;
    horsepower:                         number;
    horsepowerRpm:                      number;
    engineSize:                         string;
    engineTorque:                       number;
    engineTorqueRpm:                    number;
    priorUseDescriptions:               PriorUseDescription[];
    isAvailableToTransact:              boolean;
    recommendationType:                 null;
    bestFinanceDecision:                null;
    store:                              StoreClass;
    featureScore:                       number;
    vehicleSize:                        null;
    packages:                           string[];
    types:                              null;
    series:                             null;
    isSavedCar:                         boolean;
    heroImageUrl:                       string;
    heroThumbnailImageUrl:              null;
    isEVTaxCreditEligible:              boolean;
}

export interface PriorUseDescription {
    id:          number;
    name:        string;
    description: string;
}

export interface StoreClass {
    id:                  number;
    name:                string;
    city:                null | string;
    stateAbbreviation:   null | string;
    distanceInMiles:     number | null;
    zipCode:             null | string;
    disclaimer:          Disclaimer | null;
    currentCapabilities: string[] | null;
    disclaimerText:      null | string;
}

export interface Disclaimer {
    id:            string;
    stateCode:     string;
    fee:           number;
    feeDisclaimer: string;
}

export interface Location {
    store:         StoreClass;
    zipCode:       ZipCode;
    geoCoordinate: GeoCoordinate;
}

export interface GeoCoordinate {
    latitude:           number;
    longitude:          number;
    horizontalAccuracy: string;
    verticalAccuracy:   string;
    speed:              string;
    course:             string;
    isUnknown:          boolean;
    altitude:           string;
}

export interface ZipCode {
    code:          string;
    geoCoordinate: GeoCoordinate;
}

export interface SelectedFacet {
    category:     string;
    children:     any[];
    display:      string;
    isFilter:     boolean;
    isKeyword:    boolean;
    name:         string;
    uniqueName:   null;
    value:        string;
    isNofinement: boolean;
}

export interface SEO {
    pattern:         null;
    title:           string;
    analyticsId:     string;
    h1:              null;
    description:     string;
    keywords:        null;
    canonical:       string;
    robots:          string;
    supplements:     Supplements;
    breadcrumbs:     any[];
    articles:        any[];
    seoContent:      null;
    lunchboxContent: LunchboxContent;
    dynamicContent:  DynamicContent;
}

export interface DynamicContent {
    url:             string;
    tags:            any[];
    assignedContent: any[];
}

export interface LunchboxContent {
    faqs:                     any[];
    linkFarms:                any[];
    customerReviews:          any[];
    aggregateCustomerReviews: null;
}

export interface Supplements {
    items:               null;
    overrideSupplements: null;
    geoSupplement:       GeoSupplement;
}

export interface GeoSupplement {
    items: any[];
    title: string;
}
