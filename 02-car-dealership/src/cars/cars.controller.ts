import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

@Controller('cars')
// @UsePipes( ValidationPipe )
export class CarsController {
    constructor(private readonly carsService: CarsService){}
    
    @Get()   //endpoint //endpoint http://localhost:3000/list
    getAllCars(){  // accion
        console.log('listar');
        return this.carsService.findAll();
    }

    @Get(':id')  //endpoint http://localhost:3000/cars/3
    //@Get(':id/:name/:edad') varios parámetros en la url
    getCarById( @Param('id', ParseUUIDPipe) id: string ) {  //accion
        return this.carsService.findOneById(id); //Number(id)
        console.log (id);
    }

    @Post('new')
    // @UsePipes( ValidationPipe )
    create( @Body() dataCreateDTO: CreateCarDto ){ 
        return {
            status: 200,
            ok: true,
            datos: dataCreateDTO,
            msg: 'Car insertado'
        }
    }
    
    @Patch(':id')
    update (@Param('id', ParseUUIDPipe) id: string,  
            @Body() dataDTO: CreateCarDto){
        let car = this.carsService.findOneById(id); 
        car.model = dataDTO.model;
        return {
            status: 200,
            ok: true,
            datos: car,
            msg: `Car ${id} actualizado`
        }
    }

    @Delete(':id')
    delete (@Param('id', ParseUUIDPipe) id: number){
       //... Mandar el id al servicio para que se comunique con el SGBD
       // y elimine el objeto de la BD, validando su existencia, reglas de negocio etc
       return {
        status: 200,
        ok: true,
        msg: `Car ${id} Eliminado`
    } 
    }
}

