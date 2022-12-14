import { Module } from '@nestjs/common';
  import { PokemonService } from './pokemon.service';
  import { PokemonController } from './pokemon.controller';
  import { MongooseModule } from '@nestjs/mongoose';
  import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [MongooseModule.forFeature([ //indicamos un Modelo
    {
      name: Pokemon.name, //este name extiende del Document. Nombre entidad
      schema: PokemonSchema
    }
  ])
 ],
 exports: [ MongooseModule ] 
})
export class PokemonModule {}
