/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from 'src/producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoService } from './producto.service';
import { ProductoDto } from './producto.dto';

@Controller('producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
    constructor(private readonly ProductoService: ProductoService) {}

    @Get()
  async findAll() {
    return await this.ProductoService.findAll();
  }

  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.ProductoService.findOne(productoId);
  }

  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.ProductoService.create(producto);
  }

  @Put(':productoId')
  async update(@Param('productoId') productoId: string, @Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.ProductoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.ProductoService.delete(productoId);
  }
}
