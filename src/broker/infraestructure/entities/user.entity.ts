import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20 })
  accountnumber: string;
  // accountNumber: string; // VER POR QUÉ NO TOMA EL CHARACTER MAYUSC
}
