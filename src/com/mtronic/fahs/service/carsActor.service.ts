import { HttpException, Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ApifyClient} from "apify-client";
import { CarsActorInput } from "../carsActorTypes";
import { CarsActorQueryMapper } from "../mapper/cars-actor-query.mapper";
import { CarMaxActorQueryMapper } from "../mapper/carmax-actor-query.mapper";
import { CarsActorQueryDto } from "../dto/carsActor/cars-actor-query.dto";
import { CarMaxActorQueryDto } from "../dto/carsActor/carmax-actor-query.dto";
import { CodaService } from "src/coda/coda.service";

@Injectable()
export class CarsActorService {
    constructor (
        private configService: ConfigService,
        private carsActorQueryMapper: CarsActorQueryMapper,
        private carMaxActorQueryMapper: CarMaxActorQueryMapper,
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

        let results = [];
        if (input.provider === "carmax")
        {
            results = this.carMaxActorQueryMapper.mapCarmaxQueryResponseToCarCodaRow(CarsActorQueryDto as unknown as CarMaxActorQueryDto[])
        } else if (input.provider === "cargurus")
        {
            results = this.carsActorQueryMapper.mapCarQueryResponseToCarCodaRow(CarsActorQueryDto as unknown as CarsActorQueryDto[])
        }

        const codaTableRow = await this.codaService.getTableRows(
            'RyXHMyO6K8',
            'grid-l-ZJ2OheaK'
        );

        const existingIds = new Set(
            (codaTableRow ?? []).map(row => String(row.values["c-xm_QDr_YdW"]))
        );

        const rows = results
            .filter(car => !existingIds.has(String(car.id)))
            .map((car) => ({
                cells: [
                    { column: "c-xm_QDr_YdW", value: String(car.id) },
                    { column: "c-iN-7ozGZIV", value: car.image },
                    { column: "c-gE6_9VvMLx", value: String(car.daysOnMarket) },
                    { column: "c-3lPsImkzmq", value: car.mapUrl },
                    { column: "c-gbsFw8ZAmZ", value: car.dealer },
                    { column: "c-fGI5l_2zQS", value: car.price },
                    { column: "c-m3gt0cybrQ", value: String(car.year) },
                    { column: "c-asiSocGYjd", value: car.title },
                    { column: "c-nkjIHRCuzB", value: String(car.mileage) },
                    { column: "c-fDOEyFOrvo", value: String(car.distance) },
                    { column: "c-XS2_DmZ1DC", value:  car.storeId},
                    { column: "c-0i4pmmGyQ6", value: car.provider }
                ]
            }));
        
        let message = `Actor results processed successfully. ${results.length} cars found.`;

        if (rows.length > 0) {
            await this.codaService.createRowsInCodaTable(
                'RyXHMyO6K8',
                'grid-l-ZJ2OheaK',
                rows
            )
        }
        else 
        {
            message = 'No new cars found to add to Coda table.';
        }
        if (results.length === 0) {
            message = 'No cars found for the given criteria.';
        }
        return {
            "success": true,
            "message": message
        };
    }
}