import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/productos';


@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor( private readonly productService: ProductsService){ }
  
  async runSeed() {

    await this.insertNewProducts();
    return 'seed executed';
  }

  private async insertNewProducts(){
    
    await this.productService.deleteAllProducts();

    const seedProductos = initialData.products;
    const insertPromises = [];

    seedProductos.forEach ( producto => { 
      insertPromises.push(this.productService.create( producto ));
    });

    //Promise.all espera a que TODAS las promesas del array insertPromises se resuelvan 
    //y continúa con la siguiente línea
    await Promise.all (insertPromises);
    //obtenemos el resultado de cada promesa
    //const resuslts = await Promise.all (insertPromises);
    return true
  }

}
