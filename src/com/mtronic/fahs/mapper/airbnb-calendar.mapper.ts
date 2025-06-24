import {AirbnbLocationCalendarDto} from "../dto/actor/airbnb-location-calendar.dto";
import { Injectable } from "@nestjs/common";
import {MonthData, LocationAvailabilityDtosResponse, LocationAvailabilityDtoErrorResponse, DateData} from '@mtronic-llc/fahs-common-test';

@Injectable()
export class AirbnbCalendarMapper {
    mapAirbnbLocationCalendarDtoToLocationAvailabilityDto(
        //TODO: Derek - cambiar nombre de AvailabilityData a LocationAvailabilityDto & MonthData a MonthDataDto
        airbnbLocationCalendarDtos: AirbnbLocationCalendarDto[]): LocationAvailabilityDtosResponse[] {
        let locationAvailabilityDtos: LocationAvailabilityDtosResponse[] = [];
        const days = ['L', 'M', 'm', 'J', 'V', 'S', 'D'];

        airbnbLocationCalendarDtos.map(airbnbLocationCalendarDto => {
            try {
                const monthDataDtos: MonthData[] = airbnbLocationCalendarDto.data.data.merlin.pdpAvailabilityCalendar.calendarMonths.map(
                    calendarMonth => {
                        const numberOfDaysInMonth = calendarMonth.days.length;
                        let availableDays = 0;
                        const dates: DateData[] = [];
                        calendarMonth.days.map(day => {
                            const date = new Date(day.calendarDate);  
                            const weekDay = date.getDay() + 1;
                            dates.push(new DateData(date.toISOString().slice(0, 10), day.available, weekDay.toString(), day.availableForCheckin));
                            if (day.availableForCheckin) {
                                availableDays++;
                            }
                        });
                        const percentAvailable = (availableDays / numberOfDaysInMonth) * 100;
                        const monthDataDto: MonthData =  {
                            year: calendarMonth.year,
                            month: calendarMonth.month,
                            availabilityPercentage: percentAvailable,
                            dates
                        };
                        return monthDataDto
                    });
                const percentAvailForNext6Months = monthDataDtos.slice(0, 6)
                    .reduce(
                        (
                            percentAvailableForMonth,
                            monthDataDto
                        ) => percentAvailableForMonth + monthDataDto.availabilityPercentage, 0) / 6;
                
                locationAvailabilityDtos.push(new LocationAvailabilityDtosResponse(
                    {
                        kind: 'LocationAvailabilityDtos',
                        id: airbnbLocationCalendarDto.id,
                        nextSixMonths: percentAvailForNext6Months,
                        host: '',
                        monthAvailability: monthDataDtos
                    }
                ));
            } catch (e) {
                console.error(`Error processing AirbnbLocationCalendarDto with ID: ${airbnbLocationCalendarDto.id}`, e);
                locationAvailabilityDtos.push(new LocationAvailabilityDtosResponse(
                    new LocationAvailabilityDtoErrorResponse('Es posible que este dato ya no exista', airbnbLocationCalendarDto.id, '')
                ));
            }
        });
        return locationAvailabilityDtos;
    }
}
