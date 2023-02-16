import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateCarDto {
    //todos los campos obligatorios a la hora de insertars
    
    @IsOptional()
    id: string;

    @IsString({ message: `El campo brand debe de ser un string corto `}) //validador
    brand: string; 
    
    @IsString()
    @MinLength(3)
    readonly model: string;
}
