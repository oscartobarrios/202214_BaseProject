import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const dato: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!dato)
      throw new BusinessLogicException(
        'Producto no encontrado',
        BusinessError.NOT_FOUND,
      );
    return dato;
  }

  async create(dato: ProductoEntity): Promise<ProductoEntity> {
    if (!(dato.tipo == 'Perecedero' || dato.tipo == 'No Perecedero'))
      throw new BusinessLogicException(
        'Tipo invalido',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.productoRepository.save(dato);
  }

  async update(id: string, dato: ProductoEntity): Promise<ProductoEntity> {
    const persisted: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!persisted)
      throw new BusinessLogicException(
        'Producto no encontrado',
        BusinessError.NOT_FOUND,
      );
    if (!(dato.tipo == 'Perecedero' || dato.tipo == 'No Perecedero'))
      throw new BusinessLogicException(
        'Tipo invalido',
        BusinessError.PRECONDITION_FAILED,
      );
    dato.id = id;
    return await this.productoRepository.save({ ...persisted, ...dato });
  }

  async delete(id: string) {
    const museum: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!museum)
      throw new BusinessLogicException(
        'Producto no encontrado',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(museum);
  }
}
