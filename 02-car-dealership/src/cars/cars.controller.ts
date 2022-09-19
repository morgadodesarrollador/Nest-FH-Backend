import { Controller, Get, Param } from '@nestjs/common';

@Controller('cars')
export class CarsController {
   
    private cars = ['Honda', 'Peugeot', 'Renault', 'Mercedes'];
    
    @Get(':id')                      //endpoint http://localhost:3000/cars/3
    getCarById( @Param('id') id: string ) {  //accion
        console.log ({ id: +id });
        return this.cars[id]
    }

    @Get('list')   //endpoint //endpoint http://localhost:3000/list
    getAllCars(){  // accion
        return this.cars;
    }
}
