import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID }  from 'uuid';
import { Product, ProductImage } from './entities';
import { Console } from 'console';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {

    try {
      // en este caso ... es operador rest. El resto de propiedades caen en productDetails
      const { images = [], ...productDetails} = createProductDto;
      //crea la instancia del producto con sus propiedades
      // en este caso ... es operador spread
      const producto = this.productRepository.create({
        ...productDetails,
        images: images.map (image => this.productImageRepository.create({url: image}))
      });
      // Lo graba e impacta en la BD
      await this.productRepository.save(producto);
      // return producto;
      return { ...producto, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll( paginationDto: PaginationDTO ) {
    const { limit , offset } = paginationDto;
    //toma desde limit y salta el offest
    const productos =  await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });
    return productos.map (({images, ...rest}) => ({
      ...rest,
      images: images.map( img => img.url)
    }))
    // return productos.map (product => ({
    //   ...product,
    //   images: product.images.map( img => img.url)
    // }))
  };

  async findOne(termino: string) { //termino: uuid/slug/title
    let producto: Product;
    if ( isUUID(termino) ){
      producto = await this.productRepository.findOneBy ({id: termino})
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      producto = await queryBuilder
          .where(`UPPER(title) = :title or slug = :slug`, {
            title: termino.toUpperCase(),
            slug: termino.toLocaleLowerCase()
          })
          .leftJoinAndSelect('prod.images','prodImages')
          .getOne();
    }
    if (!producto){
      throw new NotFoundException(`Producto con ${termino} not found`)
    } 
    return producto
  }

  async findOnePlain( term: string ){
    const { images=[], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //preload busca un objeto de la BD, y se fusiona con la destructuración del dto
    //se devuelve un objeto resultante de la combinación de propiedades
    const { images, ...rest } = updateProductDto;
    const producto = await this.productRepository.preload({ id, ...rest });
   
    if(!producto) throw new NotFoundException(`Producto con id ${id} not found`);

    //create Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();          //conexión a la BD
    await queryRunner.startTransaction(); //inicio de transacción


    try {
      //si vienen imagenes de la reques (dto) --> las borro de product_images
      if (images){
        await queryRunner.manager.delete(ProductImage, { product: { id: id }});
        //ponemos las nuevas imagenes que vienen en la request (dto). NO guard
        producto.images = images.map( 
          image => this.productImageRepository.create ({ url: image }))
      }else {
        //hemos de cargar de product-images las imágenes relacionadas que hubiera
        // producto.images = await this.productImageRepository.findBy({ product: { id }});
      }
      //guardamos la info del producto pero NO SE GUARDA EN LA BD
      await queryRunner.manager.save(producto);
      // para hacer el commit, save y delete deben ser OK, pero si falla alguna 
      // hay que hacer un rollback
      await queryRunner.commitTransaction(); //SE GUARDA EN LA BD
      await queryRunner.release();

      // return (producto)
      return this.findOnePlain(id);
    } catch (error) {
      //si hay error en delete o save --> rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

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

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
              .delete()
              .where({})
              .execute()
    }catch (error){
      this.handleDBExceptions( error )
    }
  }
}
