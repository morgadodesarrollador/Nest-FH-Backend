import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto/indexCar.dto';
import { Car } from './interfaces/car.interface';

@Controller('cars')
// @UsePipes( ValidationPipe )
export class CarsController {
    constructor(private readonly carsService: CarsService){}
    
    @Get()   //endpoint //endpoint http://localhost:3000/list
    getAllCars(){  // accion
        console.log('listar');
        return this.carsService.findAll()
    }

    @Get(':id')  //endpoint http://localhost:3000/cars/3
    //@Get(':id/:name/:edad') varios parámetros en la url
    getCarById( @Param('id', ParseUUIDPipe) id: string ) {  //accion
        return this.carsService.findOneById(id); //Number(id)
        // console.log (id);
    }

    @Post()
    create( @Body() dataCar: CreateCarDto ){ 
        // dataCreateDTO.brand = 'volvo';
        return this.carsService.create(dataCar);
    }
    
    @Patch(':id')
    update (@Param('id', ParseUUIDPipe) id: string,  
            @Body() dataDTO: UpdateCarDto){
        return this.carsService.update(id, dataDTO);
    }

  
    @Delete(':id')
    delete (@Param('id', ParseUUIDPipe) id: string){
       return this.carsService.delete(id);
    }
}


