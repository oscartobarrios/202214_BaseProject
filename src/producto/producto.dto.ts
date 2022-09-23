import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { TiendaEntity } from '../tienda/tienda.entity';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly tipo: string;

  @IsString()
  @IsNotEmpty()
  readonly precio: number;

  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsUrl()
  @IsNotEmpty()
  readonly tiendas: TiendaEntity[];
}
