import { IsString, MinLength } from "class-validator";

export class CreateCarDto {

    @IsString({ message: `El campo brand debe de ser un string corto `}) //validador
    readonly brand: string; 
    @IsString()
    @MinLength(3)
    readonly model: string;
}
