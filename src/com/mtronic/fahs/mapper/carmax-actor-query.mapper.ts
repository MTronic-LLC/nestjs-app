import { Injectable } from "@nestjs/common";
import { CarMaxActorQueryDto } from "../dto/carsActor/carmax-actor-query.dto";

@Injectable()
export class CarMaxActorQueryMapper {
    mapCarmaxQueryResponseToCarCodaRow(
        carsActorQueryDto: CarMaxActorQueryDto[]
    )
    {
        const results = [];
        carsActorQueryDto.forEach((provider) => {
            provider.items.forEach((car) => {
                if (car.stockNumber)
                {
                    results.push({
                        provider: 'carmax',
                        id: car.stockNumber,
                        title: `${car.make} ${car.model}`,
                        year: car.year,
                        price: car.basePrice,
                        image: car.heroImageUrl,
                        dealer: car.storeName,
                        mapUrl: '',
                        daysOnMarket: -1,
                        distance: -1,
                        mileage: car.mileage,
                        storeId: car.storeId
                    });
                }
            });
        });
        return results;
    }
}