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
      const producto: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.cityName(),
        direccion: faker.address.direction(),
        productos: [],
      });
      tiendaList.push(producto);
    }
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all museums', async () => {
    const datos: TiendaEntity[] = await service.findAll();
    expect(datos).not.toBeNull();
    expect(datos).toHaveLength(tiendaList.length);
  });
});
