import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderModel } from './order.entity';

@Entity('instruments')
export class InstrumentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  ticker: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10 })
  type: string;

  @OneToMany(() => OrderModel, (order) => order.instrument)
  orders: OrderModel[];

  // @OneToMany(() => MarketData, marketData => marketData.instrument)
  // marketData: MarketData[];
}
