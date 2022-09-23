/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaProductoService } from '../tienda-producto/tienda-producto.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaDto } from '../tienda/tienda.dto';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaProductoController {
    constructor(private readonly tiendaProductoService: TiendaProductoService) {}

    @Post(':productoId/stores/:tiendaId')
    async addStoreToProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string) {
      return await this.tiendaProductoService.addStoreToProduct(productoId,tiendaId);
    }
  
    @Get(':productoId/stores')
    async findStoresFromProduct( @Param('productoId') productoId: string) {
      return await this.tiendaProductoService.findStoresFromProduct(productoId);
    }
  
    @Get(':productoId')
    async findStoreFromProduct(@Param('productoId') productoId: string) {
      return await this.tiendaProductoService.findStoreFromProduct(productoId);
    }
  
  
    @Put(':productoId/stores/:tiendaId')
    async updateStoresFromProduct(@Param('productoId') productoId: string, @Body() tiendaDto: TiendaDto) {
      const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
      return await this.tiendaProductoService.updateStoresFromProduct(productoId, tienda);
    }
  
    @Delete(':productoId/stores/:tiendaId')
    @HttpCode(204)
    async deleteStoresFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string) {
      return await this.tiendaProductoService.deleteStoresFromProduct(productoId,tiendaId);
    }
}
