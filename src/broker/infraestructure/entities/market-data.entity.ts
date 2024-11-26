import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('marketdata')
export class MarketData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'instrumentid' }) // -- no trae este campo
  instrument: Instrument;

  @Column({type: 'numeric'})
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
  previousclose: number; // --> si usamos camelCase se rompe 

  @Column({ type: 'date' })
  date: Date;
}
