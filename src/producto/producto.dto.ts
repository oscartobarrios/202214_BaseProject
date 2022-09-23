import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { TiendaEntity } from '../tienda/tienda.entity';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly tipo: string;

  @IsNumber()
  @IsNotEmpty()
  readonly precio: number;

  readonly tiendas: TiendaEntity[];
}
