import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.cityName(),
        direccion: faker.address.direction(),
        productos: [],
      });
      tiendaList.push(tienda);
    }
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all TIENDAS', async () => {
    const datos: TiendaEntity[] = await service.findAll();
    expect(datos).not.toBeNull();
    expect(datos).toHaveLength(tiendaList.length);
  });
  it('findOne should return a TIENDA by id', async () => {
    const stored: TiendaEntity = tiendaList[0];
    const dato: TiendaEntity = await service.findOne(stored.id);
    expect(dato).not.toBeNull();
    expect(dato.nombre).toEqual(stored.nombre);
    expect(dato.ciudad).toEqual(stored.ciudad);
    expect(dato.direccion).toEqual(stored.direccion);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Tienda no encontrada',
    );
  });

  it('create should return a new tienda', async () => {
    const mitienda: TiendaEntity = await repository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.cityName(),
      direccion: faker.address.direction(),
      productos: [],
    });

    const nueva: TiendaEntity = await service.create(mitienda);
    expect(nueva).not.toBeNull();
    const stored: TiendaEntity = await repository.findOne({
      where: { id: nueva.id },
    });
    const dato: TiendaEntity = await service.findOne(stored.id);
    expect(dato).not.toBeNull();
    expect(dato.nombre).toEqual(stored.nombre);
    expect(dato.ciudad).toEqual(stored.ciudad);
    expect(dato.direccion).toEqual(stored.direccion);
  });

  it('update should modify a tienda', async () => {
    const mitienda: TiendaEntity = tiendaList[0];
    mitienda.nombre = 'New name';
    mitienda.direccion = 'New address';
    const updated: TiendaEntity = await service.update(mitienda.id, mitienda);
    expect(updated).not.toBeNull();
    const stored: TiendaEntity = await repository.findOne({
      where: { id: mitienda.id },
    });
    expect(stored).not.toBeNull();
    expect(stored.nombre).toEqual(mitienda.nombre);
    expect(stored.direccion).toEqual(mitienda.direccion);
  });
  it('update should throw an exception for an invalid tienda', async () => {
    let dato: TiendaEntity = tiendaList[0];
    dato = {
      ...dato,
      nombre: 'New name',
      direccion: 'New type',
    };
    await expect(() => service.update('0', dato)).rejects.toHaveProperty(
      'message',
      'Tienda no encontrada',
    );
  });

  it('delete should remove a tienda', async () => {
    const dato: TiendaEntity = tiendaList[0];
    await service.delete(dato.id);
    const deleted: TiendaEntity = await repository.findOne({
      where: { id: dato.id },
    });
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid museum', async () => {
    const dato: TiendaEntity = tiendaList[0];
    await service.delete(dato.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Tienda no encontrada',
    );
  });
});
