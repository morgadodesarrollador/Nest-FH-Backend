import { PokeResponse } from './interfaces/poke.response.interface';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class SeedService {
  //creamos una dependencia de axios en mo proyecto
  private readonly axios: AxiosInstance = axios;
  
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>) {
  }
  async executeSeed(){
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');
    data.results.forEach( async ({name, url}) => {
      // console.log(name, url);
      const segmentos = url.split('/');
      const no: number = +segmentos[segmentos.length - 2];
      console.log(name, no);
      const pokemon = await this.pokemonModel.create( { name, no } );
      return  'Seed execute';
    });
  }
}
