interface CarsActorInput {
    brands: string[];
    dealers: string[];
    distance: number;
    maxDaysOnMarket: number;
    minDaysOnMarket: number;
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
}

export {
    CarsActorInput,
    CarActorResponse
}