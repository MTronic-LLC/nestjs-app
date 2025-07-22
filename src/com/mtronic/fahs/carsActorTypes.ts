interface CarsActorInput {
    provider: string;
    brands: string[];
    dealers: string[];
    distance: number;
    maxDaysOnMarket: number;
    minDaysOnMarket: number;
    mileage?: number;
    zip?: number;
    startYear?: number;
    endYear?: number;
    colors?: string[],
    maxShipPrice?: number
}

interface CarActorResponse {
    id: string;
    title: string;
    year: string;
    price: string;
    image: string;
    dealer: string;
    mapUrl: string;
    daysOnMarket: number;
    mileage: number;
    distance: number;
    provider: string;
    storeId: string;
}

export {
    CarsActorInput,
    CarActorResponse
}