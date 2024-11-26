import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { MarketData } from './market-data.entity';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  ticker: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 10 })
  type: string;

  @OneToMany(() => Order, order => order.instrument)
  orders: Order[];

  // @OneToMany(() => MarketData, marketData => marketData.instrument)
  // marketData: MarketData[];
}
