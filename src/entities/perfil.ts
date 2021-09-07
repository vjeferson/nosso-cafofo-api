import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "perfil" })
export class Perfil {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  descricao!: string;

  @Column()
  tipo_perfil!: number;
}