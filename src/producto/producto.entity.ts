import { Column, Entity, ManyToMany,PrimaryGeneratedColumn } from 'typeorm';
import { TiendaEntity } from 'src/tienda/tienda.entity';
@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  precio: number;

  @ManyToMany(() => TiendaEntity, (tienda) => tienda.productos)
  tiendas: TiendaEntity[];
}
