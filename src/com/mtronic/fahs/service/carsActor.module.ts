import { Module } from "@nestjs/common";
import { CarsActorService } from "./carsActor.service";
import { CarsActorQueryMapper } from "../mapper/cars-actor-query.mapper";

@Module({
    imports: [],
    providers: [CarsActorService, CarsActorQueryMapper]
})
export class carsActorModule {}
