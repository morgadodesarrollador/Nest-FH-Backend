import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    //createPokemonDto ya se encuentra validado y podemos insertarlo sin problemas
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    }catch (error) {
      this.handleException( error );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) { //termino de busqueda
    let pokemon: Pokemon;
    //verificación por no 
    if ( !isNaN(+term)){ //si es un numero (no)
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    //verificación por mongoid
    if ( !pokemon && isValidObjectId(term)) { //si el termino es un mongoid
      pokemon = await this.pokemonModel.findById(term);
    }
    //verificación por name
    if (!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() })
    }
    if (!pokemon){
      throw new NotFoundException( `Pokemon con name or no "${ term }" not found`)
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //buscamos el pokemon por un termino
    const pokemon = await this.findOne (term);
    if (updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try{
      //nos devuelve el pokemon como MODELO. Le pasamos el dto que viene por url
      await pokemon.updateOne( updatePokemonDto); 
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    }catch (error){
      this.handleException( error );
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    // await pokemon.deleteOne();
    const { deletedCount } =  await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon con el id "${id}" not found`);
    return;
  }

  private handleException( error: any ){
    //manejamos excepciones NO CONTROLADAS
    if (error.code === 11000){   
      throw new BadRequestException(`El Pokemon existe en la BD ${ JSON.stringify(error.keyValue) }`);
    }
    console.log(error);   //lanzamos la excepción si es otro error <> 11000
    throw new InternalServerErrorException(`No se puede crear el Pokemon. Chequear server logs`);
  }
}
