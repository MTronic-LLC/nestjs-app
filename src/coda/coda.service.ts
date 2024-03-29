import axios from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as filters from './coda.filters.json';

@Injectable()
export class CodaService {
    constructor(private configService: ConfigService) {}
    //TODO: cambiar metodo y logica ser getIdsConPocoInteresOMas(): Promise<string[]> {
    public async getIdsOfPlacesWithLittleInterestOrMore(): Promise<string[]> {
        const codaDocID = this.configService.get<string>('CODA_DOC_ID'); //doc id de fahs,

        if (codaDocID) {
            const codaApiKey = this.configService.get<string>('CODA_API_KEY'); // api key de fahs
            const headers: Record<string, string> = {
                Authorization: `Bearer ${codaApiKey}`,
            };
            let placesId: string[] = [];

            try {
                const response = await axios.get(
                    `https://coda.io/apis/v1/docs/${codaDocID}/tables/grid-54ktLB_93G/rows`,
                    {
                        headers,
                    },
                );
                //Para cada item, obtengo el id y lo agrego a un array
                placesId = response.data.items
                    .map((item: any) => {
                        let currentPlaceId = item.values['c-OCMBG1whUA'];
                        if (!currentPlaceId.includes('datosDePrueba')) {
                            //Aplico filtros definidos en el archivo coda.filters.json
                                //convierto el precio a number
                                let numberPrice = Number(item.values['c-P1PHzAXpXt'].replace(/[^0-9.-]+/g,""));
                                item.values['c-P1PHzAXpXt'] = numberPrice;
                                //Aplico los filtros de coda.filters.json a cada item
                                Object.entries(filters).forEach(([key, value]) => {
                                    if (value.type === 'max') {
                                        if (item.values[key] > value.value) {
                                            currentPlaceId = null;
                                        }
                                    } else if (value.type === 'min') {
                                        if (item.values[key] < value.value) {
                                            currentPlaceId = null;
                                        }
                                    } else if (value.type === 'list') {
                                        if (Array.isArray(value.value)) {
                                            if (!value.value.includes(item.values[key])) {
                                                currentPlaceId = null;
                                            }
                                        }
                                    }
                                });
                            return currentPlaceId;
                        }
                        return null;
                    }).filter((id: string) => id != null);

            } catch (error) {
                console.error(error);
                throw new HttpException(
                    'Error al obtener los ids de la página',
                    500,
                );
            }

            if (placesId.length > 0) {
                return placesId;
            } else {
                throw new HttpException(
                    'No existen datos que cumplan con los filtros',
                    404,
                );
            }

        } else {
            throw new HttpException('Documento no encontrado', 404);
        }
    }
}
