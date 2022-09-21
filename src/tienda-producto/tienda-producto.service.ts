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
    tiendaId: string,
    productoId: string,
  ): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
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

    tienda.productos = [...tienda.productos, producto];
    return await this.tiendaRepository.save(tienda);
  }

  async findStoresFromProduct(
    tiendaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
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

    return tiendaproducto;
  }

  async findStoreFromProduct(tiendaId: string): Promise<ProductoEntity[]> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
      relations: ['productos'],
    });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return tienda.productos;
  }

  async updateStoresFromProduct(
    tiendaId: string,
    productos: ProductoEntity[],
  ): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
      relations: ['productos'],
    });

    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: productos[i].id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'The producto with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    tienda.productos = productos;
    return await this.tiendaRepository.save(tienda);
  }

  async deleteStoreFromProduct(tiendaId: string, productoId: string) {
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
