import { Injectable } from "@nestjs/common";
import { CarsActorQueryDto } from "../dto/carsActor/cars-actor-query.dto";

@Injectable()
export class CarsActorQueryMapper {
    mapCarQueryResponseToCarCodaRow(
        carsActorQueryDto: CarsActorQueryDto[]
    )
    {
        return carsActorQueryDto.flatMap((provider) => {
            return provider.tiles.map(car => ({
                id: car.data.id,
                title: car.data.listingTitle,
                year: car.data.carYear,
                price: car.data.priceString,
                image: car.data.originalPictureData?.url,
                dealer: car.data.serviceProviderName,
                mapUrl: car.data.googleStaticMapUrl,
                daysOnMarket: car.data.daysOnMarket
            }));
        });
    }
}