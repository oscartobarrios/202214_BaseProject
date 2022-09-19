import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [TiendaModule, ProductoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
