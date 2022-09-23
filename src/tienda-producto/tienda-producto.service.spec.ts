import { TiendaProductoService } from './tienda-producto.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let tienda: TiendaEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: 'hola',
        tipo: 'ojo',
        precio: faker.datatype.number(1000),
        tiendas: [],
      });
      productosList.push(producto);
    }

    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.direction(),
      productos: productosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an producto to a tienda', async () => {
    const miproducto: ProductoEntity = await productoRepository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    const mitienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.direction(),
      productos: [],
    });

    const result: TiendaEntity = await service.addStoreToProduct(
      mitienda.id,
      miproducto.id,
    );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(miproducto.nombre);
    expect(result.productos[0].tipo).toBe(miproducto.tipo);
    expect(result.productos[0].precio).toBe(miproducto.precio);
  });

  it('addStoreToProduct should thrown exception for an invalid producto', async () => {
    const mitienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'BOG',
      direccion: faker.address.direction(),
      productos: [],
    });

    await expect(() =>
      service.addStoreToProduct(mitienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addproductotienda should throw an exception for an invalid tienda', async () => {
    const miproducto: ProductoEntity = await productoRepository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    await expect(() =>
      service.addStoreToProduct('0', miproducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('findStoresFromProduct should return producto by tienda', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedproducto: ProductoEntity = await service.findStoresFromProduct(
      tienda.id,
      producto.id,
    );
    expect(storedproducto).not.toBeNull();
    expect(storedproducto.nombre).toBe(producto.nombre);
    expect(storedproducto.tipo).toBe(producto.tipo);
    expect(storedproducto.precio).toBe(producto.precio);
  });

  it('findStoresFromProduct should throw an exception for an invalid producto', async () => {
    await expect(() =>
      service.findStoresFromProduct(tienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('findStoresFromProduct should throw an exception for an invalid tienda', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.findStoresFromProduct('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('findStoresFromProduct should throw an exception for an producto not associated to the tienda', async () => {
    const miproducto: ProductoEntity = await productoRepository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    await expect(() =>
      service.findStoresFromProduct(tienda.id, miproducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id is not associated to the tienda',
    );
  });

  it('findStoreFromProduct should return productos by tienda', async () => {
    const productos: ProductoEntity[] = await service.findStoreFromProduct(
      tienda.id,
    );
    expect(productos.length).toBe(5);
  });

  it('findStoreFromProduct should throw an exception for an invalid tienda', async () => {
    await expect(() =>
      service.findStoreFromProduct('0'),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('updateStoresFromProduct should update productos list for a tienda', async () => {
    const miproducto: ProductoEntity = await productoRepository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    const updatedtienda: TiendaEntity = await service.updateStoresFromProduct(
      tienda.id,
      [miproducto],
    );
    expect(updatedtienda.productos.length).toBe(1);

    expect(updatedtienda.productos[0].nombre).toBe(miproducto.nombre);
    expect(updatedtienda.productos[0].tipo).toBe(miproducto.tipo);
    expect(updatedtienda.productos[0].precio).toBe(miproducto.precio);
  });

  it('updateStoresFromProduct should throw an exception for an invalid tienda', async () => {
    const miproducto: ProductoEntity = await productoRepository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    await expect(() =>
      service.updateStoresFromProduct('0', [miproducto]),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('updateStoresFromProduct should throw an exception for an invalid producto', async () => {
    const newproducto: ProductoEntity = productosList[0];
    newproducto.id = '0';

    await expect(() =>
      service.updateStoresFromProduct(tienda.id, [newproducto]),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should remove an producto from a tienda', async () => {
    const producto: ProductoEntity = tienda.productos[0];

    await service.deleteStoreFromProduct(tienda.id, producto.id);

    const storedtienda: TiendaEntity = await tiendaRepository.findOne({
      where: { id: tienda.id },
      relations: ['productos'],
    });
    const deletedproducto: ProductoEntity = storedtienda.productos.find(
      (a) => a.id === producto.id,
    );

    expect(deletedproducto).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid producto', async () => {
    await expect(() =>
      service.deleteStoreFromProduct(tienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid tienda', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.deleteStoreFromProduct('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The tienda with the given id was not found',
    );
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated producto', async () => {
    const miproducto: ProductoEntity = await productoRepository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    await expect(() =>
      service.deleteStoreFromProduct(tienda.id, miproducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The producto with the given id is not associated to the tienda',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
