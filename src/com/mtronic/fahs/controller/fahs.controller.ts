import { Body, Controller, Get, HttpException, HttpStatus, Post, Param, Query } from "@nestjs/common";
import {ActorService} from "../service/actor.service";
import {CodaService} from "../../../../coda/coda.service";
import { LocationDetailsDtos, LocationsByRegion, LocationAvailabilitySavedDtosResponseBackend } from "@mtronic-llc/fahs-common-test";
import { LocationAvailabilityDtosResponse } from "@mtronic-llc/fahs-common-test";
import { BackendActorAvailabilityQuery, BackendActorPlacesQuery} from '@mtronic-llc/fahs-common-test';
import {AvailablePlaceService} from "src/database/stay-search-places/available-place.service";
import { AvailablePlace } from "src/database/stay-search-places/available-place-interface";
import { FahsService } from "../service/fahs.service";

@Controller("fahs")
export class FahsController {
    constructor (
        private readonly actorService: ActorService, 
        private readonly codaService: CodaService,
        private readonly availablePlaceService: AvailablePlaceService,
        private readonly fahsService: FahsService
    ) {}

    @Get('getPlacesAvailability')
    async getAvailabilityOfPlacesOfInterest(): Promise<LocationAvailabilityDtosResponse[]> {
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

    @Post('getAvailablePlacesFromRegions')
    async getAvailablePlacesFromRegions(@Body() body: BackendActorPlacesQuery): Promise<LocationsByRegion> {
        try {
            const { checkin, checkout, regions } = body;
            const DateFormat = /^\d{4}-\d{2}-\d{2}$/;

            if (!regions || regions.length === 0 || regions[0] === '') {
                console.log('No se especificaron regiones');
                throw new HttpException('No se especificaron regiones', 400);
            }
            if (!checkin || !checkout || !DateFormat.test(checkin) || !DateFormat.test(checkout)) {
                console.log('Formato de fecha inválido');
                throw new HttpException('Formato de fecha inválido (YYYY-MM-DD)', 400);
            }

            const rawRegionsData = await this.actorService.getIdsOfUbications(regions);
            const regionsData: { name: string; id: string }[] = rawRegionsData.map((region: any) => ({
                name: String(region.name),
                id: String(region.id)
            }));

            let allPlaces: LocationDetailsDtos[] = [];
            let regionsWithoutResults: string[] = [];

            if (body.refresh) {
                console.log('Modo refresh activado, se buscarán todas las regiones');
                regionsWithoutResults = regionsData.map(region => region.name);
            } else {
                for (const region of regionsData) {
                    console.log(`Buscando lugares en la base de datos para la región: ${region.name}`);
                    const resultPlaces: LocationDetailsDtos[] = await this.availablePlaceService.getPlacesAvailabilityBetweenDates(
                        checkin,
                        checkout,
                        [region.id]
                    );

                    if (resultPlaces.length > 0) {
                        console.log(`Se encontraron ${resultPlaces.length} lugares en la base de datos para la región: ${region.name}`);
                        allPlaces = allPlaces.concat(resultPlaces);
                    } else if (region.name) {
                        console.log(`No se encontraron lugares en la base de datos para la región: ${region.name}`);
                        regionsWithoutResults.push(region.name);
                    }
                }
            }

            if (regionsWithoutResults.length > 0 || body.refresh) {
                console.log('Regiones sin resultados en base de datos o modo refresh:', regionsWithoutResults);

                const totalDays = Math.ceil(
                    (new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000 * 60 * 60 * 24)
                );
                let foundPlaces: LocationDetailsDtos[] = [];
                let interval = 1;
                let pagesToFetch = 1;

                while (foundPlaces.length === 0 && pagesToFetch <= 3 && interval <= totalDays) {
                    console.log(`Intentando con pagesToFetch=${pagesToFetch}, interval=${interval}`);
                    let places: LocationDetailsDtos[] = await this.actorService.queryAvailablePlaces({
                        checkin,
                        checkout,
                        regions: regionsWithoutResults,
                        pagesToFetch,
                        interval,
                        refresh: body.refresh
                    });

                    if (places.length > 0) {
                        console.log(`Se encontraron ${places.length} lugares con pagesToFetch=${pagesToFetch} e interval=${interval}`);
                        foundPlaces = places;
                    } else {
                        if (interval < totalDays) {
                            interval++;
                        } else {
                            interval = 1;
                            pagesToFetch++;
                        }
                    }
                }

                if (foundPlaces.length > 0) {
                    foundPlaces = this.availablePlaceService.calculateAvailabilityPercentForStays(foundPlaces, checkin, checkout);
                    allPlaces = allPlaces.concat(foundPlaces);
                } else {
                    console.log('No se encontraron lugares tras intentar todas las combinaciones de pagesToFetch e interval');
                }
            }

            console.log(`Total de lugares encontrados: ${allPlaces.length}`);
            return { places: allPlaces };
        } catch (error) {
            console.error('Error en getAvailablePlacesFromRegions:', error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Error al obtener los datos del actor',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @Post('getAvailabilityOfPlacesOfInterestWithIds')
    async getAvailabilityOfPlacesOfInterestWithIds(@Body() body: BackendActorAvailabilityQuery): Promise<LocationAvailabilityDtosResponse[]> {
        try {           
            return await this.actorService.getAvailabilityOfPlacesOfInterest(body);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Error al obtener los datos del actor',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @Get('getIdsOfPlacesByCodaPage/:page')
    async getIdsOfPlacesByCodaPage(@Param('page') page: string): Promise<string[]> {
        try {
            return await this.codaService.getIdsOfPlacesByPage(page);
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
    }
    @Get('runJobToGetPlacesAvailability')
    async runJobToGetPlacesAvailability(
        @Query('checkin') checkin: string,
        @Query('checkout') checkout: string,
        @Query('region') region: string | string[]
    ) {
        if (!checkin || !checkout || !region) {
            return {
                message: 'Please provide checkin, checkout, and region parameters',
                status: HttpStatus.BAD_REQUEST
            }
        } else {
            const regions = Array.isArray(region) ? region : [region];
            this.actorService.queryAvailablePlaces({
                checkin,
                checkout,
                regions,
                pagesToFetch: 1
            });
            return {
                message: 'Job to get places availability started successfully',
                checkin,
                checkout,
                regions
            }
        }
    }
    @Post('rejectSelectedPlaces')
    async rejectPlacesWithIds(@Body() body: { ids: string[] }): Promise<{ status: string }> {
        const { ids } = body;
        if (!ids || ids.length === 0) {
            throw new HttpException('No IDs provided for rejection', HttpStatus.BAD_REQUEST);
        }
        try {
            await this.availablePlaceService.rejectPlacesWithIds(ids);
            return { status: 'success' };
        }
        catch (error) {
            console.error('Error rejecting places:', error);
            throw new HttpException('Error rejecting places', HttpStatus.INTERNAL_SERVER_ERROR);
        }   
    }
    @Post('getPlacesAvailability')
    async getAvailabilityOfSavedPlacesOfInterestWithIds(@Body() body: {codaView: string, refresh: boolean}): Promise<LocationAvailabilitySavedDtosResponseBackend> {
        return await this.fahsService.getPlacesAvailabilityByCodaView(body);
    }
}
