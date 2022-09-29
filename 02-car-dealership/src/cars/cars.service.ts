import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from "uuid";
import { CreateCarDto, UpdateCarDto } from './dto/indexCar.dto';
@Injectable()
export class CarsService {
    
    private cars:Car[] = [
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

    findOneById(id: string){
        console.log (id);
        const car = this.cars.find(car => car.id === id);
        if (!car){
            throw new NotFoundException(`Car with id '${ id }' not found `);
        }
        // return this.cars[id];
        return car;
    }

    public findAll(){
        // console.log(this.cars);
        return this.cars;
    }

    create ( carDTO: CreateCarDto){
        const car : Car = {
            id: uuid(),
            ...carDTO
            // brand: carDTO.brand,
            // model: carDTO.model
        }
        this.cars.push(car);
        return car;
    }

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
        const carDB = this.findOneById(id);    
        //con filter recorremos el array y devolvemos todos los coches
        //con id <> al que deseo eliminar
        this.cars = this.cars.filter(car => car.id != id); 
        // this.cars = this.cars.filter(car => {
        //     if (car.id != id)
        //         return car
        // } 
        
    }
}
