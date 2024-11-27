import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { InstrumentModel } from './instrument.entity';

@Entity('orders')
export class OrderModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  instrumentid: number;

  @Column({ type: 'numeric' })
  userid: number;

  @Column()
  size: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 10 })
  type: string;

  @Column({ length: 10 })
  side: string;

  @Column({ length: 20 })
  status: string;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @ManyToOne(() => InstrumentModel, (instrument) => instrument.orders)
  @JoinColumn({ name: 'instrumentid' })
  instrument: InstrumentModel;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userid' })
  user: User;
}
