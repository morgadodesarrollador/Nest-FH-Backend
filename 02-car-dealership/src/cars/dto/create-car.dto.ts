import { IsString } from "class-validator";

export class CreateCarDto {

    @IsString({ message: `El campo brand debe de ser un string corto `}) //validador
    readonly brand: string; 
    @IsString()
    readonly model: string;
}
