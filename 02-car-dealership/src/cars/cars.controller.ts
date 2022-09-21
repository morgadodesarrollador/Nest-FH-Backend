import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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
    //@Get(':id/:name/:edad') varios parámetros en la url
    getCarById( @Param('id', ParseIntPipe) id: number ) {  //accion
        
        return this.carsService.findOneById(id); //Number(id)
        console.log (id);
    }

    @Post('new')
    //asociamos la variable data al @Body de la Request y de tipo any
    create( @Body() data: any ){ 
        return {
            status: 200,
            ok: true,
            datos: data,
            msg: 'Car insertado'
        }
    }
    
    @Patch(':id')
    update (@Param('id', ParseIntPipe) id: number,  
            @Body() data: any){
        let car = this.carsService.findOneById(id); 
        car.model = data.model;
        return {
            status: 200,
            ok: true,
            datos: car,
            msg: `Car ${id} actualizado`
        }
    }

    @Delete(':id')
    delete (@Param('id', ParseIntPipe) id: number){
       //... Mandar el id al servicio para que se comunique con el SGBD
       // y elimine el objeto de la BD, validando su existencia, reglas de negocio etc
       return {
        status: 200,
        ok: true,
        msg: `Car ${id} Eliminado`
    } 
    }
}

