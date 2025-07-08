import { HttpException, Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ApifyClient} from "apify-client";
import { CarsActorInput } from "../carsActorTypes";
import { CarsActorQueryMapper } from "../mapper/cars-actor-query.mapper";
import { CarsActorQueryDto } from "../dto/carsActor/cars-actor-query.dto";

@Injectable()
export class CarsActorService {
    constructor (
        private configService: ConfigService,
        private carsActorQueryMapper: CarsActorQueryMapper
    ) {}
    public async getActorResults(
        input: CarsActorInput
    ) {
        const apifyApiKey = this.configService.get<string>('APIFY_API_KEY');
        const apifyClient = new ApifyClient({
            token: apifyApiKey
        });
        const runActor = await apifyClient.actor('cJduc2OPxGclrCgYH').call(input);
        const {items: CarsActorQueryDto} = await apifyClient.dataset(runActor.defaultDatasetId).listItems();
        console.log('Actor results:', CarsActorQueryDto);
        return this.carsActorQueryMapper.mapCarQueryResponseToCarCodaRow(CarsActorQueryDto as unknown as CarsActorQueryDto[]);

    }
}