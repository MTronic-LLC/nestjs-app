import { Controller, Get, Param } from "@nestjs/common";
import { CodaService } from "./coda.service";
import { CodaViewRowsResponseDto } from "./dto/coda/codaViewRows.dto";
import { JobService } from "src/jobs/jobs.service";
@Controller("coda")
export class codaController {
    constructor (
        private readonly codaService: CodaService,
        private readonly jobService: JobService
    ) {}
    
    @Get('getRowsByView/:view')
    async getRowsByView(@Param('view') view: string): Promise<CodaViewRowsResponseDto> {
        return await this.codaService.getPlacesDataByView(view);
    }

    @Get('getControlValueById/:id')
    async getControlValueById(@Param('id') id: string): Promise<any> {
        return await this.codaService.getControlValueById(id);
    }

    @Get('runNotificationJob')
    async runNotificationJob() {
        this.jobService.getAvailabilityOfUnavailablePlaces();
        return { message: 'Job started' };
    }

    /*@Get('testnotify')
    async testNotificationInactivePlace() {
        const availability = await this.actorService.getAvailabilityOfPlacesOfInterest({
            ids: ['725418743400555112']
        });
        const placeAvailability = availability[0];
        if (placeAvailability.response.kind !== ''){
            await this.codaService.placeAvailabileAgainCodaWebHook(459, '725418743400555112','Hospedanos', placeAvailability.response.meses)
        }
    }*/
}