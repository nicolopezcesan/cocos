import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InstrumentModel } from './instrument.entity';

@Entity('marketdata')
export class MarketDataModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InstrumentModel)
  @JoinColumn({ name: 'instrumentid' })
  instrument: InstrumentModel;

  @Column({ type: 'numeric' })
  instrumentid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  high: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  low: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  open: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  close: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  previousclose: number;

  @Column({ type: 'date' })
  date: Date;
}
