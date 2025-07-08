import { HttpException, Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ApifyClient} from "apify-client";
import { CarsActorInput } from "../carsActorTypes";
import { CarsActorQueryMapper } from "../mapper/cars-actor-query.mapper";
import { CarsActorQueryDto } from "../dto/carsActor/cars-actor-query.dto";
import { CodaService } from "src/coda/coda.service";

@Injectable()
export class CarsActorService {
    constructor (
        private configService: ConfigService,
        private carsActorQueryMapper: CarsActorQueryMapper,
        private codaService: CodaService
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
        const results = this.carsActorQueryMapper.mapCarQueryResponseToCarCodaRow(CarsActorQueryDto as unknown as CarsActorQueryDto[]);
        const rows = results.map((car) => {
            return {
                cells: [
                    {
                        column: "c-xm_QDr_YdW",
                        value: String(car.id)
                    },
                    {
                        column: "c-iN-7ozGZIV",
                        value: car.image
                    },
                    {
                        column: "c-gE6_9VvMLx",
                        value: String(car.daysOnMarket)
                    },
                    {
                        column: "c-3lPsImkzmq",
                        value: car.mapUrl
                    },
                    {
                        column: "c-gbsFw8ZAmZ",
                        value: car.dealer
                    },
                    {
                        column: "c-fGI5l_2zQS",
                        value: car.price
                    },
                    {
                        column: "c-m3gt0cybrQ",
                        value: String(car.year)
                    }, 
                    {
                        column: "c-asiSocGYjd",
                        value: car.title
                    }
                ]
            }
        })
        this.codaService.createRowsInCodaTable(
            'RyXHMyO6K8',
            'grid-l-ZJ2OheaK',
            rows
        )
        return {
            "success": true,
            "message": "Actor results processed successfully"
        };
    }
}