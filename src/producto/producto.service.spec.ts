import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: 'hola',
        tipo: 'ojo',
        precio: faker.datatype.number(1000),
        tiendas: [],
      });
      productosList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all PRODUCTO', async () => {
    const pro: ProductoEntity[] = await service.findAll();
    expect(pro).not.toBeNull();
    expect(pro).toHaveLength(productosList.length);
  });

  it('findOne should return a PRDUCTO by id', async () => {
    const stored: ProductoEntity = productosList[0];
    const dato: ProductoEntity = await service.findOne(stored.id);
    expect(dato).not.toBeNull();
    expect(dato.nombre).toEqual(stored.nombre);
    expect(dato.precio).toEqual(stored.precio);
    expect(dato.tipo).toEqual(stored.tipo);
  });

  it('findOne should throw an exception for an invalid PRODUCTO', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Producto no encontrado',
    );
  });

  it('create should return a new product', async () => {
    const miproducto: ProductoEntity = await repository.save({
      nombre: 'hola',
      tipo: 'Perecedero',
      precio: faker.datatype.number(1000),
      tiendas: [],
    });

    const nueva: ProductoEntity = await service.create(miproducto);
    expect(nueva).not.toBeNull();
    const stored: ProductoEntity = await repository.findOne({
      where: { id: nueva.id },
    });
    const dato: ProductoEntity = await service.findOne(stored.id);
    expect(dato).not.toBeNull();
    expect(dato.nombre).toEqual(stored.nombre);
    expect(dato.precio).toEqual(stored.precio);
    expect(dato.tipo).toEqual(stored.tipo);
  });

  it('update should modify a product', async () => {
    const dato: ProductoEntity = productosList[0];
    dato.nombre = 'New name';
    dato.tipo = 'Perecedero';
    dato.precio = 52000;
    const updated: ProductoEntity = await service.update(dato.id, dato);
    expect(updated).not.toBeNull();
    const stored: ProductoEntity = await repository.findOne({
      where: { id: dato.id },
    });
    expect(stored).not.toBeNull();
    expect(stored.nombre).toEqual(dato.nombre);
    expect(stored.precio).toEqual(dato.precio);
  });

  it('update should throw an exception for an invalid product', async () => {
    let dato: ProductoEntity = productosList[0];
    dato = {
      ...dato,
      nombre: 'New name',
      tipo: 'Perecedero',
    };
    await expect(() => service.update('0', dato)).rejects.toHaveProperty(
      'message',
      'Producto no encontrado',
    );
  });

  it('update should throw an exception for an invalid type product', async () => {
    const dato: ProductoEntity = productosList[1];
    dato.nombre = 'New name';
    dato.tipo = 'xxxx';
    await expect(() => service.update(dato.id, dato)).rejects.toHaveProperty(
      'message',
      'Tipo invalido',
    );
  });

  it('delete should remove a product', async () => {
    const dato: ProductoEntity = productosList[0];
    await service.delete(dato.id);
    const deleted: ProductoEntity = await repository.findOne({
      where: { id: dato.id },
    });
    expect(deleted).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const dato: ProductoEntity = productosList[0];
    await service.delete(dato.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Producto no encontrado',
    );
  });
});
