export interface CarsActorQueryDto {
    totalListings:                    number;
    environmentInfoDto:               EnvironmentInfoDto;
    developmentInfoDto:               DevelopmentInfoDto;
    userSegmentationInfoDto:          UserSegmentationInfoDto;
    pageInfoDto:                      PageInfoDto;
    srpTrackingData:                  SrpTrackingData;
    tiles:                            Tile[];
    pageReceipt:                      string;
    pageCount:                        number;
    listingSearchSessionId:           string;
    search:                           Search;
    searchForm:                       SearchForm;
    searchRegion:                     Region;
    internalUserOnlyData:             InternalUserOnlyData;
    filters:                          Filters;
    adContext:                        AdContext;
    googleAnalyticsAccountNumber:     string;
    googleMapApiKey:                  string;
    smsVerifyOwnershipNumber:         string;
    smsSendToPhoneNumber:             string;
    nationwideSearchDistance:         number;
    user:                             User;
    canShowHomeDeliveryMarketingCard: boolean;
    defaultBestMatchSort:             boolean;
    seoExperimentV2Dtos:              SEOExperimentV2Dto[];
    seoDataPreflightDto:              InternalUserOnlyData;
    srpSections:                      string[];
}

export interface AdContext {
    dma:                 string;
    sZipUS:              string;
    dfpAccountId:        string;
    isDisplayEngTestAds: boolean;
    makeName:            MakeName;
}

export enum MakeName {
    Audi = "Audi",
    Honda = "Honda",
}

export interface DevelopmentInfoDto {
    deploymentLoc:  string;
    production:     boolean;
    serverHostName: string;
    buildId:        string;
    viewVersion:    string[];
}

export interface EnvironmentInfoDto {
    applicationLocaleId:   string;
    countryCode:           string;
    jsLocaleId:            string;
    languageTag:           string;
    localeId:              string;
    localeName:            string;
    localeNamespace:       string;
    applicationUrl:        string;
    viewVersionNames:      string[];
    reportingViewVersions: string[];
    uuid:                  string;
    production:            boolean;
    serviceName:           string;
    blackoutTexas:         boolean;
    emailHash:             string;
    experience:            string;
    deviceOs:              string;
    seoExperiments:        SEOExperiments;
    seoExperimentsV2:      SEOExperimentsV2;
    mvtExperiments:        MvtExperiments;
}

export interface MvtExperiments {
    VDP_STICKYFOOTER_DD_CTA:              AdsLoadLibraryPostOnetrustLoad;
    VS_TEST_NEW_USER:                     string;
    DD_WIZARD_INTG:                       AdsLoadLibraryPostOnetrustLoad;
    DRT_PROXY_MIGRATION:                  string;
    SSR_PROXY_MIGRATION_POC:              AdsLoadLibraryPostOnetrustLoad;
    CF_RECOMMENDED_LISTINGS_DASHBOARD:    string;
    SORT_TEST_LTV1:                       AdsLoadLibraryPostOnetrustLoad;
    SRP_PRICE_DROP_NEW_ARRIVAL_BADGES:    AdsLoadLibraryPostOnetrustLoad;
    MVT_ADMIN_SSR_PROXY_MIGRATION:        string;
    SNOWTYPE_HOMEPAGE:                    AdsLoadLibraryPostOnetrustLoad;
    CF_LOGIN_PARITY_2:                    string;
    VDP_ANONYMIZED_LEADS_MESSAGING:       AdsLoadLibraryPostOnetrustLoad;
    VDP_ONSITE_ADS_TEST:                  AdsLoadLibraryPostOnetrustLoad;
    SPONSORED_LISTINGS_OPT_TEST:          AdsLoadLibraryPostOnetrustLoad;
    SRP_WEB_AD_TEST:                      string;
    VDP_WEB_AD_TEST:                      string;
    LEAD_BUILDER_V2:                      string;
    SORT_TEST_HIF:                        AdsLoadLibraryPostOnetrustLoad;
    SUPPRESSED_PRIMARY_OFFER:             string;
    AUTOSHOW_USES_ORCHESTRATION:          string;
    SEARCH_AS_FILTERS_TEST3:              string;
    CF_FOS_OFFER_DETAILS:                 string;
    LEAD_FORM_INPUT_VALIDATION:           string;
    SIGN_IN_MODAL_SWAP:                   AdsLoadLibraryPostOnetrustLoad;
    SMC_LANDING_PAGE_BUTTON:              string;
    PRSN_DS_GEN_AI_REC_TITLES:            AdsLoadLibraryPostOnetrustLoad;
    DISABLE_ADS_CLEAR_TARGETING:          string;
    IDG_CADD_NO_LOGIN:                    AdsLoadLibraryPostOnetrustLoad;
    MARKETING_VIRAL_SO_JUNE2025:          string;
    MCAS_CREATE_ACCOUNT_GATE:             AdsLoadLibraryPostOnetrustLoad;
    APP_AA_TEST:                          AdsLoadLibraryPostOnetrustLoad;
    SIP_SNOWPLOW_SECONDARY_PIPELINE:      AdsLoadLibraryPostOnetrustLoad;
    TOP_DEALER_AWARDS_2024:               string;
    SITE_LPO_BUILDER_MVT:                 AdsLoadLibraryPostOnetrustLoad;
    SHOPPER_CONTACT_INFO:                 AdsLoadLibraryPostOnetrustLoad;
    APP_TYPEAHEAD_MEILI_VS_OPEN_2:        string;
    SIP_SNOWPLOW_PRIMARY_PIPELINE_SWITCH: string;
    VDP_ABOVE_THE_FOLD_NEW_INFOBLOCK:     AdsLoadLibraryPostOnetrustLoad;
    CF_PREQUAL_FILTER_TOGGLE:             string;
    ADS_LOAD_LIBRARY_POST_ONETRUST_LOAD:  AdsLoadLibraryPostOnetrustLoad;
    CF_BHPH_PHASE_1:                      string;
    REMOVE_MARKETING_VIRAL:               string;
    SORT_TEST_NEW_CAR_V2:                 string;
    CF_RECOMMENDED_LISTINGS_VDP:          string;
    LEAD_NUDGE:                           string;
}

export enum AdsLoadLibraryPostOnetrustLoad {
    Default = "DEFAULT",
}

export interface SEOExperiments {
    SEO_TEST_PROOF_OF_CONCEPT: number;
}

export interface SEOExperimentsV2 {
    SRP_REMOVE_BREADCRUMBS:                    string;
    EXPAND_SPT_EXPERIMENT2:                    string;
    SEOC_2936_CF_CHASSIS_2_US:                 string;
    SPT_REMOVE_FEATURED_LISTINGS:              string;
    SRP_ENTITY_FACTS_CAR_MODEL:                string;
    SRP_CANONICAL_LOGIC:                       string;
    SEOC_3724_SRP_NEW_MODEL_METADATA_TEST:     string;
    SPT_REMOVE_ADS_V2:                         string;
    SRP_NATIONWIDE_ZIP_MODAL:                  string;
    SEOC_3438_CAR_LEVEL_SORT_TEST:             string;
    SEOC_2936_CF_CHASSIS_2_INTL:               string;
    SEOC_3709_SRP_H1_TITLE_NEAR_ME:            string;
    SEOC_3813_UK_MODEL_AUTOSHOW_OVERVIEW_TEST: string;
    SEOC_2352_SRP_IMAGES_HIGH_PRIORITY:        string;
    SEOC_3346_BOUNCE_RATE_VALIDATION_2:        string;
    UGC_RATING_BANNER:                         string;
    SEOC_3060_NO_GEO_NON_RELAXED:              string;
}

export interface Filters {
    BODY_TYPE_GROUP:            BODYTYPEGROUPClass;
    COLOR:                      BODYTYPEGROUPClass;
    DAYS_ON_MARKET:             DaysOnMarket;
    DEAL_RATING:                BODYTYPEGROUPClass;
    DRIVETRAIN:                 BODYTYPEGROUPClass;
    FINANCE_PARTNERS:           BODYTYPEGROUPClass;
    FUEL_CONSUMPTION:           DaysOnMarket;
    FUEL_TYPE:                  BODYTYPEGROUPClass;
    HAS_PHOTOS:                 BODYTYPEGROUPClass;
    HAS_ACCIDENTS:              BODYTYPEGROUPClass;
    HAS_RECENT_PRICE_DROPS:     BODYTYPEGROUPClass;
    HAS_FRAME_DAMAGE:           BODYTYPEGROUPClass;
    HAS_THEFT_HISTORY:          BODYTYPEGROUPClass;
    HAS_FINANCING:              BODYTYPEGROUPClass;
    INTERIOR_COLOR:             BODYTYPEGROUPClass;
    IS_FLEET:                   BODYTYPEGROUPClass;
    IS_LEMON:                   BODYTYPEGROUPClass;
    IS_SALVAGE:                 BODYTYPEGROUPClass;
    IS_SINGLE_OWNER:            BODYTYPEGROUPClass;
    SHOP_BY_TYPE:               BODYTYPEGROUPClass;
    MILEAGE:                    DaysOnMarket;
    PRICE:                      DaysOnMarket;
    NUMBER_OF_DOORS:            BODYTYPEGROUPClass;
    TRANSMISSION_TYPE:          BODYTYPEGROUPClass;
    VEHICLE_CONDITION:          BODYTYPEGROUPClass;
    VEHICLE_OPTION:             BODYTYPEGROUPClass;
    NCAP_OVERALL_SAFETY_RATING: BODYTYPEGROUPClass;
    YEAR:                       Year;
    SEARCH_DISTANCE:            SearchDistance;
    IS_EV_OR_PHEV:              BODYTYPEGROUPClass;
    IS_DIGITAL_DEAL:            BODYTYPEGROUPClass;
    NUMBER_OF_SEATS:            BODYTYPEGROUPClass;
    BUY_ONLINE_TYPE:            BuyOnlineType;
    ENGINE_HIERARCHY:           BODYTYPEGROUPClass;
    VEHICLE_HISTORY_OPTIONS:    BODYTYPEGROUPClass;
    MAKE_MODEL:                 MakeModel;
}

export interface BODYTYPEGROUPClass {
    filters: BODYTYPEGROUPFilter[];
    name:    string;
    label:   string;
}

export interface BODYTYPEGROUPFilter {
    name:           string;
    label:          string;
    inputValue:     string;
    count:          number;
    availableCount: number;
}

export interface BuyOnlineType {
    name:  string;
    label: string;
}

export interface DaysOnMarket {
    value: Value;
    name:  string;
    label: string;
}

export interface Value {
    min:          number;
    max:          number;
    availableMin: number;
    availableMax: number;
}

export interface MakeModel {
    filters: MAKEMODELFilter[];
    name:    string;
    label:   string;
}

export interface MAKEMODELFilter {
    isPopular?:     boolean;
    name:           string;
    label:          string;
    inputValue:     string;
    count:          number;
    availableCount: number;
    filters?:       MAKEMODELFilter[];
}

export interface SearchDistance {
    filters: BodyTypeGroupElement[];
    name:    string;
    label:   string;
}

export interface BodyTypeGroupElement {
    value: string;
    text:  string;
}

export interface Year {
    years:    number[];
    minValue: number;
    maxValue: number;
    name:     string;
    label:    string;
}

export interface InternalUserOnlyData {
}

export interface PageInfoDto {
    pageTitle:  string;
    headerText: string;
}

export interface Search {
    zip:                       string;
    distance:                  number;
    selectedEntity:            string;
    sourceContext:             string;
    startYear:                 number;
    endYear:                   number;
    maxMileage:                number;
    daysOnMarketMin:           number;
    daysOnMarketMax:           number;
    geoLocation:               GeoLocation;
    priceDropsOnly:            boolean;
    colors:                    any[];
    interiorColors:            any[];
    insuranceGroupLevels:      any[];
    entityName:                MakeName;
    autoEntityInfo:            AutoEntityInfo;
    locationInferred:          boolean;
    inventorySearchWidgetType: string;
    sortDir:                   string;
    sortType:                  string;
    shopByTypes:               string[];
    locationDisplayName:       string;
    makeModelTrimPaths:        SelectedMakeID[];
    srpVariation:              string;
    config:                    { [key: string]: boolean };
    isDeliveryEnabled:         boolean;
    filterTagInfo:             FilterTagInfo;
}

export interface AutoEntityInfo {
    entityId:   SelectedMakeID;
    entityType: string;
    make:       MakeName;
}

export enum SelectedMakeID {
    M19 = "m19",
    M6 = "m6",
}

export interface FilterTagInfo {
    filterTags: any[];
}

export interface GeoLocation {
    latitude:  number;
    longitude: number;
}

export interface SearchForm {
    selectedMakeId:           SelectedMakeID;
    selectedEntities:         SelectedMakeID[];
    yearsRange:               number[];
    usedCarSearchDistances:   BodyStyleSearchDistanceElement[];
    bodyStyleSearchDistances: BodyStyleSearchDistanceElement[];
    priceSearchDistances:     BodyStyleSearchDistanceElement[];
    bodyTypeGroups:           BodyTypeGroupElement[];
}

export interface BodyStyleSearchDistanceElement {
    value: number;
    text:  string;
}

export enum Region {
    FL = "FL",
    Sc = "SC",
}

export interface SEOExperimentV2Dto {
    experimentName:    string;
    activeVariantName: string;
}

export interface SrpTrackingData {
    defaultSRPListingCount: DefaultSRPListingCount;
}

export interface DefaultSRPListingCount {
    convertListingsCount:       number;
    buyOnlineListingsCount:     number;
    storeTransferListingsCount: number;
    homeDeliveryListingsCount:  number;
    totalListings:              number;
}

export interface Tile {
    type: Type;
    data: Data;
}

export interface Data {
    id?:                           number;
    inclusionType?:                AdsLoadLibraryPostOnetrustLoad;
    listingSource?:                ListingSource;
    listingTitle?:                 string;
    makeName?:                     MakeName;
    modelName?:                    string;
    makeId?:                       SelectedMakeID;
    modelId?:                      string;
    entityId?:                     string;
    carYear?:                      number;
    trimName?:                     string;
    localizedTransmission?:        LocalizedTransmission;
    bodyTypeGroupId?:              BodyTypeGroupID;
    bodyTypeName?:                 BodyTypeName;
    salesStatus?:                  SalesStatus;
    sortScore?:                    number;
    options?:                      string[];
    mileage?:                      number;
    mileageString?:                string;
    unitMileage?:                  CityFuelEconomy;
    exteriorColorName?:            string;
    normalizedExteriorColor?:      string;
    price?:                        number;
    priceString?:                  string;
    expectedPrice?:                number;
    expectedPriceString?:          string;
    priceDifferential?:            number;
    priceDifferentialString?:      string;
    dealScore?:                    number;
    daysOnMarket?:                 number;
    dealRating?:                   DealRating;
    pictureCount?:                 number;
    originalPictureData?:          OriginalPictureData;
    sellerId?:                     number;
    listingPartnerId?:             number;
    sellerType?:                   SellerType;
    dealerName?:                   ErName;
    sellerCity?:                   SellerCity;
    sellerRegion?:                 Region;
    sellerPostalCode?:             string;
    distance?:                     number;
    googleStaticMapUrl?:           string;
    serviceProviderId?:            number;
    debugInfo?:                    string;
    serviceProviderName?:          ErName;
    phoneNumber?:                  PhoneNumber;
    phoneNumberString?:            PhoneNumberString;
    phoneNumberSMS?:               string;
    supportsSms?:                  boolean;
    localizedDriveTrain?:          LocalizedDriveTrain;
    localizedExteriorColor?:       string;
    localizedInteriorColor?:       string;
    sellerRating?:                 number;
    reviewCount?:                  number;
    howToShop?:                    HowToShop;
    financeDto?:                   FinanceDto;
    offset?:                       number;
    cityFuelEconomy?:              CityFuelEconomy;
    highwayFuelEconomy?:           CityFuelEconomy;
    combinedFuelEconomy?:          CityFuelEconomy;
    localizedFuelEconomy?:         string[];
    localizedFuelType?:            LocalizedFuelType;
    localizedCombinedFuelEconomy?: string;
    evBatteryDto?:                 EvBatteryDto;
    localizedEngineDisplayName?:   string;
    ncapOverallSafetyRating?:      string;
    vin?:                          string;
    stockNumber?:                  string;
    interiorColor?:                string;
    eligibleProducts?:             string[];
    metadata?:                     Metadata;
    isCPO?:                        boolean;
    cpoTier?:                      number;
    dealerLogoUrl?:                string;
}

export enum BodyTypeGroupID {
    Bg3 = "bg3",
    Bg6 = "bg6",
    Bg7 = "bg7",
}

export enum BodyTypeName {
    Hatchback = "Hatchback",
    SUVCrossover = "SUV/Crossover",
    Sedán = "Sedán",
}

export interface CityFuelEconomy {
    value: number;
    unit:  Unit;
}

export enum Unit {
    Miles = "MILES",
    Mpg = "MPG",
}

export enum DealRating {
    FairPrice = "FAIR_PRICE",
    GoodPrice = "GOOD_PRICE",
    PoorPrice = "POOR_PRICE",
}

export enum ErName {
    CarMaxColumbia = "CarMax Columbia",
    CarMaxJacksonville = "CarMax Jacksonville",
}

export interface EvBatteryDto {
    capacity?: string;
}

export interface FinanceDto {
    financingEligibilityLookup: FinancingEligibilityLookup[];
}

export enum FinancingEligibilityLookup {
    CapitalOne = "CAPITAL_ONE",
}

export enum HowToShop {
    PickUpOnly = "PICK_UP_ONLY",
}

export enum ListingSource {
    CarMax1 = "CarMax-1",
}

export enum LocalizedDriveTrain {
    TracciónDelantera = "Tracción delantera",
    TracciónEnLasCuatroRuedas = "Tracción en las cuatro ruedas",
}

export enum LocalizedFuelType {
    Gasolina = "Gasolina",
    Híbrido = "Híbrido",
}

export enum LocalizedTransmission {
    Automática = "Automática",
}

export interface Metadata {
    videoUrl:   string;
    pictureUrl: string;
}

export interface OriginalPictureData {
    url:    string;
    height: number;
    width:  number;
}

export enum PhoneNumber {
    The13343779947 = "+1 334-377-9947",
    The18038254747 = "+1 803-825-4747",
}

export enum PhoneNumberString {
    The3343779947 = "(334) 377-9947",
    The8038254747 = "(803) 825-4747",
}

export enum SalesStatus {
    Paying = "PAYING",
}

export enum SellerCity {
    ColumbiaSC = "Columbia, SC",
    JacksonvilleFL = "Jacksonville, FL",
}

export enum SellerType {
    Dealer = "DEALER",
}

export enum Type {
    ListingUsedStandard = "LISTING_USED_STANDARD",
    Merch = "MERCH",
}

export interface User {
    savedListingsCount:       number;
    unreadNotificationsCount: number;
}

export interface UserSegmentationInfoDto {
    firstWebSession: boolean;
}
