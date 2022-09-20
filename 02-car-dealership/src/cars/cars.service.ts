import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {
    private cars = [
        {
            id: 1,
            brand: 'Honda',
            model: 'Civic'
        },
        {
            id: 2,
            brand: 'Peugeot',
            model: '3008'
        },
        {
            id: 3,
            brand: 'Renault',
            model: 'Clio'
        },
        {
            id: 4,
            brand: 'Jeep',
            model: 'Cheroke'
        },
    ];

    findOneById(id: number){
        console.log (id);
        const car = this.cars.find(car => car.id === id)
        // return this.cars[id];
        return car;
    }

    public findAll(){
        // console.log(this.cars);
        return this.cars;
    }
}
