import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { 
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type:'text',
        nullable: true
    })
    description: string;

    @Column('text',{
        unique:true
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @OneToMany(
        () => ProductImage, //regresa un PI
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    //tags
    //imagess
    //mas caompos

    //Antes de insertar ejecutamos el método updateSlug()
    @BeforeInsert()
    checkSlugInsert(){
        
        if (!this.slug){
            this.slug = this.title
        }
        this.slug = this.slug 
                       .toLowerCase()
                       .replaceAll(' ', '_')
                       .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate(){

        if (!this.slug){
            this.slug = this.title
        }
        console.log(this.slug);
        this.slug = this.slug 
                       .toLowerCase()
                       .replaceAll(' ', '_')
                       .replaceAll("'", '')

    }

}
