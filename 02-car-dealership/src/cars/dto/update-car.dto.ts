import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateCarDto {
    //puedo modificar algunos campos
    @IsString()
    @IsUUID()
    @IsOptional()
    readonly id?: string;

    @IsString({ message: `El campo brand debe de ser un string corto `}) //validador
    @IsOptional()
    readonly brand?: string; 

    @IsString()
    @MinLength(3)
    @IsOptional()
    readonly model?: string;
}
