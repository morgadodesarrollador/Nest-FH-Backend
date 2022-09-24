import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from "uuid";
import { CreateCarDto } from './dto/create-car.dto';
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

    // create ( { model, brand }: CreateCarDto){
    //     const car : Car = {
    //         id: uuid(),
    //         brand,
    //         model
    //     }
    // }
}
