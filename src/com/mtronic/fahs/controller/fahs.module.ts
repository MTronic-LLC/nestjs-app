import { Module } from "@nestjs/common";
import { FahsController } from "./fahs.controller";
import { CodaModule } from "../../../../coda/coda.module";
import { ActorModule } from "../service/actor.module";
import { ActorService } from "../service/actor.service";
import { CodaService } from "../../../../coda/coda.service";
import {AirbnbCalendarMapper} from "../mapper/airbnb-calendar.mapper";
import { MongoModule } from "src/database/Mongo.module";
import { FahsService } from "../service/fahs.service";
import { carsActorModule } from "../service/carsActor.module";
import { CarsActorService } from "../service/carsActor.service";
import { CarsActorQueryMapper } from "../mapper/cars-actor-query.mapper";
import { CarMaxActorQueryMapper } from "../mapper/carmax-actor-query.mapper";
//import {AirbnbStaySearchMapper} from "../mapper/airbnb-stay-search.mapper";

@Module({
    imports: [MongoModule, CodaModule, ActorModule, carsActorModule],
    providers: [CodaService, ActorService, CarsActorService, AirbnbCalendarMapper, FahsService, CarsActorQueryMapper, CarMaxActorQueryMapper /*AirbnbStaySearchMapper*/],
    controllers: [FahsController]
})
export class FahsModule {}
