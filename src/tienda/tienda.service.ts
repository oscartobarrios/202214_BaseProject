import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}
  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find();
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const dato: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!dato)
      throw new BusinessLogicException(
        'Tienda no encontrada',
        BusinessError.NOT_FOUND,
      );

    return dato;
  }

  async create(museum: TiendaEntity): Promise<TiendaEntity> {
    return await this.tiendaRepository.save(museum);
  }

  async update(id: string, dato: TiendaEntity): Promise<TiendaEntity> {
    const persisted: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persisted)
      throw new BusinessLogicException(
        'Tienda no encontrada',
        BusinessError.NOT_FOUND,
      );
    dato.id = id;
    return await this.tiendaRepository.save({ ...persisted, ...dato });
  }

  async delete(id: string) {
    const museum: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!museum)
      throw new BusinessLogicException(
        'Tienda no encontrada',
        BusinessError.NOT_FOUND,
      );

    await this.tiendaRepository.remove(museum);
  }
}
