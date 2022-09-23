import { Module } from '@nestjs/common';
import { TiendaProductoService } from './tienda-producto.service';
import { TiendaProductoController } from './tienda-producto.controller';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoService } from '../producto/producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaService } from '../tienda/tienda.service';

@Module({
  providers: [TiendaProductoService, ProductoService, TiendaService],
  controllers: [TiendaProductoController],
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]),
    TypeOrmModule.forFeature([TiendaEntity]),
  ],
})
export class TiendaProductoModule {}
