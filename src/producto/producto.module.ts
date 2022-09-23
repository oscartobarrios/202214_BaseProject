import { Module } from '@nestjs/common';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoController } from './producto.controller';
@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductoController],
})
export class ProductoModule {}
