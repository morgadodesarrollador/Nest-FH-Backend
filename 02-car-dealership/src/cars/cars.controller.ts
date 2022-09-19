import { Controller, Get } from '@nestjs/common';

@Controller('cars')
export class CarsController {
   
    @Get('list')
    getAllCars(){
        return ['Honda', 'Peugeot', 'Renault', 'Mercedes'];
    }
}
