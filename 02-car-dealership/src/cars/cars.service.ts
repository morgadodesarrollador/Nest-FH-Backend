import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from "uuid";
import { CreateCarDto, UpdateCarDto } from './dto/indexCar.dto';
import { find } from 'rxjs';
@Injectable()
export class CarsService {
    public edad: number = 10;
    private cars:Car[] = [
        {
            id: '10',
            brand: 'Honda',
            model: 'Civic'
        },
        {
            id: '2',
            brand: 'Peugeot',
            model: '3008'
        },
        {
            id: '13',
            brand: 'Renault',
            model: 'Clio'
        },
        {
            id: '4',
            brand: 'Jeep',
            model: 'Cheroke'
        },
    ];
    private cars1:Car[] = [
        {
            id: uuid(),
            brand: 'Honda',
            model: 'Civic'
        },
        {
            id: uuid(),
            brand: 'Peugeot',
            model: '3008'
        },
        {
            id: uuid(),
            brand: 'Renault',
            model: 'Clio'
        },
        {
            id: uuid(),
            brand: 'Jeep',
            model: 'Cheroke'
        },
    ];

    hola() {
        return 'hola desde el servicio';
    }
    
    findOneById(id: string){
        //select car.* from cars where car.id = ${id}
        console.log (id);
        const car = this.cars.find(car => car.id === id);
        if (!car){
            throw new NotFoundException(`Car with id '${ id }' not found `);
        }
        return car;
    }

    findAll(){
        // console.log(this.cars);
        //llamada asincrona a la BD 
        //select * from cars
        return this.cars;
    }
    create (dataCar: Car){
        const ultimo = this.cars[this.cars.length - 1];
        console.log (ultimo);
        const newId = +ultimo.id + 1;
        dataCar.id = newId.toString();
        this.cars.push(dataCar);
        return `insertado el ${dataCar.brand} modelo ${dataCar.model}`;
    }

    // create1 ( carDTO: CreateCarDto){
    //     const car : ICar[] = {
    //         id: uuid(),
    //         ...carDTO
    //         // brand: carDTO.brand,
    //         // model: carDTO.model
    //     }
    //     this.cars.push(car);
    //     return car;
    // }

    update (id: string, CarDTO: UpdateCarDto){
        let carDB = this.findOneById(id);    
        //map devuelva un array de cars
        this.cars = this.cars.map ( car => { 
            if (car.id === id){
                carDB = {
                    ...carDB, //todos los campos de la BD
                    ...CarDTO, //se sobreescriben con los campos de la Request
                    id
                }
                return carDB //el car modificado
            }
            return car //el mismo car
        });
        //devolvamos el carDB actualizador
        return carDB;
    }
    delete (id: string){

        // const posicion = +id - 1;
        // console.log (posicion);
        // this.cars.splice(posicion,1);
       
        this.cars = this.cars.filter(car => car.id != id); 
        return `el car ${id} ha sido eliminado de la BD`;
       
        // const carDB = this.findOneById(id);    
        // 
        
        
    }

    // delete (id: string){
    //     const carDB = this.findOneById(id);    
    //     //con filter recorremos el array y devolvemos todos los coches
    //     //con id <> al que deseo eliminar
    //     this.cars = this.cars.filter(car => car.id != id); 
    //     // this.cars = this.cars.filter(car => {
    //     //     if (car.id != id)
    //     //         return car
    //     // } 
        
    // }
}


