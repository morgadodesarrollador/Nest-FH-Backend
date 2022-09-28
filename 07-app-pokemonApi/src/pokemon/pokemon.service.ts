import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
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
      if (error.code === 11000){   //lanzamos la excepción con un mensaje personalizado
        throw new BadRequestException(`El Pokemon existe en la BD ${ JSON.stringify(error.keyValue) }`);
      }
      console.log(error);   //lanzamos la excepción si es otro error <> 11000
      throw new InternalServerErrorException(`No se puede crear el Pokemon. Chequear server logs`);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
