import { Injectable } from "@nestjs/common";
import { CarsActorQueryDto } from "../dto/carsActor/cars-actor-query.dto";

@Injectable()
export class CarsActorQueryMapper {
    mapCarQueryResponseToCarCodaRow(
        carsActorQueryDto: CarsActorQueryDto[]
    )
    {
        const results = [];
        carsActorQueryDto.forEach((provider) => {
            if (!provider.tiles || !Array.isArray(provider.tiles)) {
                console.log("No tiles found in provider:", provider);
                return;
            }
            provider.tiles.forEach((car) => {
                if (
                    Array.isArray(car.data.eligibleProducts) &&
                    car.data.eligibleProducts.length === 1 &&
                    car.data.eligibleProducts[0] === 'VIDEO_CAMPAIGN'
                ) {
                    return; 
                }
                if (!car.data.id) {
                    console.log("Car data is missing id:", car.data);
                    return;
                }
                results.push({
                    provider: 'cargurus',
                    id: car.data.id,
                    title: car.data.listingTitle,
                    year: car.data.carYear,
                    price: car.data.priceString,
                    image: car.data.originalPictureData?.url,
                    dealer: car.data.serviceProviderName,
                    mapUrl: car.data.googleStaticMapUrl,
                    daysOnMarket: car.data.daysOnMarket,
                    distance: car.data.distance ? car.data.distance : -1,
                    mileage: car.data.mileage,
                    storeId: ''
                });
            });
        });
        return results;
    }
}