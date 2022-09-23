/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaProductoService } from '../tienda-producto/tienda-producto.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaDto } from '../tienda/tienda.dto';

@Controller('tienda-producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaProductoController {
    constructor(private readonly tiendaProductoService: TiendaProductoService) {}

    @Post('products/:productoId/stores/:tiendaId')
    async addStoreToProduct(@Param('tiendaId') tiendaId: string, @Param('productoId') productoId: string) {
      return await this.tiendaProductoService.addStoreToProduct(tiendaId,productoId);
    }
  
    @Get('products/:productoId/stores/:tiendaId')
    async findStoresFromProduct( @Param('tiendaId') tiendaId: string, @Param('productoId') productoId: string) {
      return await this.tiendaProductoService.findStoresFromProduct(productoId);
    }
  
    @Get('products/:productoId')
    async findStoreFromProduct(@Param('productoId') productoId: string) {
      return await this.tiendaProductoService.findStoreFromProduct(productoId);
    }
  
  
    @Put('products/:productoId/stores/:tiendaId')
    async updateStoresFromProduct(@Param('productoId') productoId: string, @Body() tiendaDto: TiendaDto) {
      const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
      return await this.tiendaProductoService.updateStoresFromProduct(productoId, tienda);
    }
  
    @Delete('products/:productoId/stores/:tiendaId')
    @HttpCode(204)
    async deleteStoresFromProduct(@Param('tiendaId') tiendaId: string, @Param('productoId') productoId: string) {
      return await this.tiendaProductoService.deleteStoresFromProduct(tiendaId,productoId);
    }
}
