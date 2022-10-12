import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID }  from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {

    try {
      //crea la instancia del producto con sus propiedades
      const producto = this.productRepository.create(createProductDto);
      // Lo graba e impacta en la BD
      await this.productRepository.save(producto);
      return producto;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll( paginationDto: PaginationDTO ) {
    const { limit , offset } = paginationDto;
    //toma desde limit y salta el offest
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(termino: string) { //termino: uuid/slug/title
    let producto: Product;
    if ( isUUID(termino) ){
      producto = await this.productRepository.findOneBy ({id: termino})
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      producto = await queryBuilder
          .where(`UPPER(title) = :title or slug = :slug`, {
            title: termino.toUpperCase(),
            slug: termino.toLocaleLowerCase()
          }).getOne();
    }
    if (!producto){
      throw new NotFoundException(`Producto con ${termino} not found`)
    } 
    return producto
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //preload busca un objeto de la BD, y se fusiona con la destructuración del dto
    //se devuelve un objeto resultante de la combinación de propiedades
    const producto = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if(!producto) throw new NotFoundException(`Producto con id ${id} not found`);
    try {
      await this.productRepository.save(producto);
      return (producto)
    } catch (error) {
      this.handleDBExceptions(error);
    }
    
    
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productRepository.remove(producto);
  }

  private handleDBExceptions( error: any ){
    if (error.code === '23505'){
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error, check server logs!')
  }
}
