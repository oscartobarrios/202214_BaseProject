import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaProductoService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addStoreToProduct(
    productoId: string,
    tiendaId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    console.log(producto);
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The store with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    producto.tiendas = [...producto.tiendas, tienda];
    tienda.productos = [...tienda.productos, producto];
    this.tiendaRepository.save(tienda);
    return await this.productoRepository.save(producto);
  }

  async findStoresFromProduct(productoId: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas;
  }

  async findStoreFromProduct(productoId: string): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas[0];
  }

  async updateStoresFromProduct(
    ProductoId: string,
    tienda: TiendaEntity,
  ): Promise<ProductoEntity> {
    const prod: ProductoEntity = await this.productoRepository.findOne({
      where: { id: ProductoId },
    });

    if (!prod)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < prod.tiendas.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: prod[i].id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'The producto with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }
    prod.tiendas.push(tienda);
    return prod;
  }

  async deleteStoresFromProduct(productoId: string, tiendaId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tiendaproducto: ProductoEntity = tienda.productos.find(
      (e) => e.id === producto.id,
    );

    if (!tiendaproducto)
      throw new BusinessLogicException(
        'The producto with the given id is not associated to the tienda',
        BusinessError.PRECONDITION_FAILED,
      );

    tienda.productos = tienda.productos.filter((e) => e.id !== productoId);
    await this.tiendaRepository.save(tienda);
  }
}
