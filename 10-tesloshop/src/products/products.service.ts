import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

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

  findAll() {
    return this.productRepository.find({});
  }

  async findOne(id: string) {
    const producto = await this.productRepository.findOneBy( { id });
    if (!producto){
      throw new NotFoundException(`Producto con id ${id} not found`)
    } 
    return producto
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
