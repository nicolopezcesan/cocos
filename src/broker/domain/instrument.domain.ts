import { InstrumentModel } from "../infraestructure/entities/instrument.entity";

export interface IInstrument {
  id: number;
  ticker: string;
  name: string;
  type: string;
};

export class Instrument implements IInstrument {
  public id: number;
  public ticker: string;
  public name: string;
  public type: string;

  constructor(instrument: InstrumentModel) {
    this.id = instrument.id;
    this.ticker = instrument.ticker;
    this.name = instrument.name;
    this.type = instrument.type;
  }
}