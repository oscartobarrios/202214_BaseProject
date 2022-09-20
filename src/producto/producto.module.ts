import { Module } from '@nestjs/common';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
})
export class ProductoModule {}
