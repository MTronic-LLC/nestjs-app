import { Body, Controller, Get, HttpException, HttpStatus, Post, Param, Query } from "@nestjs/common";
import {ActorService} from "../service/actor.service";
import {CodaService} from "../../../../coda/coda.service";
import { LocationAvailabilityDtosRequest, LocationAvailabilityDtosResponseBackend, LocationAvailabilitySavedDtosResponseBackend } from "@mtronic-llc/fahs-common-test";
import { BackendActorAvailabilityQuery } from '@mtronic-llc/fahs-common-test';
import { FahsService } from "../service/fahs.service";
import { CarsActorService } from "../service/carsActor.service";
import { CarsActorInput } from "../carsActorTypes";
@Controller("fahs")
export class FahsController {
    constructor (
        private readonly actorService: ActorService, 
        private readonly codaService: CodaService,
        private readonly fahsService: FahsService,
        private readonly carsActorService: CarsActorService
    ) {}

    @Get('getAvailabilityOfPlacesOfInterest')
    async getAvailabilityOfPlacesOfInterest(): Promise<LocationAvailabilityDtosResponseBackend> {
        try {
            //const ids: string[] = await this.codaService.getIdsOfPlacesWithLittleInterestOrMore(); //TODO: intercambiar por llamada a datos de prueba para desarrollo
            const ids: string[] = ['39925068', '38132540', /*'44521091', '35460354','51843505'*/]; //TODO: intercambiar por llamada a coda para produccion
            const input: BackendActorAvailabilityQuery = {ids};
            return await this.actorService.getAvailabilityOfPlacesOfInterest(input);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Error al obtener los datos del actor' + error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    /*@Post('getAvailablePlacesFromRegions')
    async getAvailablePlacesFromRegions(@Body() body: BackendActorPlacesQuery): Promise<LocationsByRegion[]> {
        try {
            const { checkin, checkout, regions } = body;
            const DateFormat = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

            if (regions == undefined || regions.length == 0 || regions[0] == '') {
                throw new HttpException('No se especificaron regiones', 400);
            }

            if (checkin == undefined || checkout == undefined || !DateFormat.test(checkin) || !DateFormat.test(checkout)) {
                throw new HttpException('Formato de fecha inválido (YYYY-MM-DD)', 400);
            }

            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            
            if (checkinDate < currentDate || checkoutDate < currentDate) {
                throw new HttpException('Fechas inválidas', 400);
            }

            if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
                throw new HttpException('Alguna de las fechas no existe', 400);
            }

            return await this.actorService.getAvailablePlacesFromRegions(body);
        } catch (error) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Error al obtener los datos del actor',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }*/

    @Post('getPlacesAvailability')
    async getAvailabilityOfSavedPlacesOfInterestWithIds(@Body() body: {codaView: string, refresh: boolean}): Promise<LocationAvailabilitySavedDtosResponseBackend> {
        return await this.fahsService.getPlacesAvailabilityByCodaView(body);
    }

    @Get('getCars')
    async getCars(
        @Query('provider') provider: string,
        @Query('dealers') dealers: string | string[],
        @Query('brands') brands: string | string[],
        @Query('minDaysOnMarket') minDaysOnMarket: string,
        @Query('maxDaysOnMarket') maxDaysOnMarket: string,
        @Query('distance') distance: string,
        @Query('mileage') mileage?: string,
        @Query('zip') zip?: string,
        @Query('startYear') startYear?: string,
        @Query('endYear') endYear?: string,
        @Query('colors') colors?: string | string[],
        @Query('maxShipPrice') maxShipPrice?: string

    ): Promise<any> {
        if (
            !dealers ||
            !brands 
        ) {
            throw new HttpException(
                'All parameters (dealers, brands, minDaysOnMarket, maxDaysOnMarket, distance) are required',
                HttpStatus.BAD_REQUEST
            );
        }
        try {
            const input: CarsActorInput = {
                provider,
                dealers: Array.isArray(dealers) ? dealers : [dealers],
                brands: Array.isArray(brands) ? brands : [brands],
                minDaysOnMarket: Number(minDaysOnMarket || -1),
                maxDaysOnMarket: Number(maxDaysOnMarket || -1),
                distance: Number(distance || -1),
            };

            if (mileage) {
                input.mileage = Number(mileage);
            }

            if (zip) {
                input.zip = Number(zip);
            }

            if (startYear) {
                input.startYear = Number(startYear);
            }

            if (endYear) {
                input.endYear = Number(endYear);
            }

            if (colors) {
                input.colors = Array.isArray(colors) ? colors : [colors];
            }

            if (maxShipPrice) {
                input.maxShipPrice = Number(maxShipPrice);
            }

            return await this.carsActorService.getActorResults(input);
        }
        catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                console.error('Error al obtener los datos del actor', error);
                throw new HttpException(
                    'Error al obtener los datos del actor',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    /*@Get('getPlacesDataByCodaPage/:page')
    async getPlacesDataByCodaPage(@Param('page') page: string): Promise<{host: string, id: string, rowID: number}[]> {
        try {
            return await this.codaService.getPlacesDataByPage(page);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Error al obtener los ids de la página',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }*/
}
