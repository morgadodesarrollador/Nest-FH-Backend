import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
   
    constructor(private readonly carsService: CarsService){}
    
    @Get('list')   //endpoint //endpoint http://localhost:3000/list
    getAllCars(){  // accion
        console.log('listar');
        return this.carsService.findAll();
    }

    @Get(':id')  //endpoint http://localhost:3000/cars/3
    getCarById( @Param('id', ParseIntPipe) id: number ) {  //accion
        
        return this.carsService.findOneById(id); //Number(id)
        console.log (id);
        
    }
}
