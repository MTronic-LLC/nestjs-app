import { Module } from "@nestjs/common";
import { CarsActorService } from "./carsActor.service";
import { CarsActorQueryMapper } from "../mapper/cars-actor-query.mapper";
import { CodaModule } from "src/coda/coda.module";
import { CodaService } from "src/coda/coda.service";

@Module({
    imports: [CodaModule],
    providers: [CarsActorService, CarsActorQueryMapper, CodaService]
})
export class carsActorModule {}
