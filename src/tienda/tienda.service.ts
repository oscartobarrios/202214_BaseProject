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

  async create(dato: TiendaEntity): Promise<TiendaEntity> {
    let regexp: RegExp;
    regexp = new RegExp('[A-Z]{3}');
    if (!regexp.test(dato.ciudad))
      throw new BusinessLogicException(
        'La ciudad solo debe tener 3 Caracteres en Mayuscula',
        BusinessError.PRECONDITION_FAILED,
      );
    return await this.tiendaRepository.save(dato);
  }

  async update(id: string, dato: TiendaEntity): Promise<TiendaEntity> {
    let regexp = new RegExp('[A-Z]{3}');
    const persisted: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persisted)
      throw new BusinessLogicException(
        'Tienda no encontrada',
        BusinessError.NOT_FOUND,
      );
    if (!regexp.test(dato.ciudad))
      throw new BusinessLogicException(
        'La ciudad solo debe tener 3 Caracteres en Mayuscula',
        BusinessError.PRECONDITION_FAILED,
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
