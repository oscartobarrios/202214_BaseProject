import { Module } from '@nestjs/common';
import { TiendaProductoService } from './tienda-producto.service';

@Module({
  providers: [TiendaProductoService]
})
export class TiendaProductoModule {}
