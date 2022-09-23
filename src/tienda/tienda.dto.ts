import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ProductoEntity } from '../producto/producto.entity';
export class TiendaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;

  readonly productos: ProductoEntity[];
}
