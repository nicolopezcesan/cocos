import { ORDER_TYPE, ORDER_SIDE, ORDER_STATUS } from "../infraestructure/enums/order.enum";
import { IInstrument } from "./instrument.domain";

export interface IOrder {
  id: number;
  size: number;
  price: string;
  type: ORDER_TYPE;
  side: ORDER_SIDE;
  status: ORDER_STATUS;
  datetime: string;
  instrumentid: number;
  instrument: IInstrument
  isBuyOrSell(): Boolean;
  isBuy(): Boolean;
  isSell(): Boolean;
  isStatusFilled(): Boolean;
}

export class Order implements IOrder {
  public id: number;
  public size: number;
  public price: string;
  public type: ORDER_TYPE;
  public side: ORDER_SIDE;
  public status: ORDER_STATUS;
  public datetime: string;
  public instrumentid: number;
  public instrument: IInstrument;

  constructor(order: any) {
    this.id = order.id;
    this.size = order.size;
    this.price = order.price;
    this.type = order.type;
    this.side = order.side;
    this.status = order.status;
    this.datetime = order.datetime;
    this.instrumentid = order.instrumentid;
    this.instrument = order.instrument;
  }

  isBuyOrSell(): Boolean {
    return this.side === ORDER_SIDE.BUY || this.side === ORDER_SIDE.SELL;
  }

  isBuy(): Boolean {
    return this.side === ORDER_SIDE.BUY;
  }

  isSell(): Boolean {
    return this.side === ORDER_SIDE.SELL;
  }

  isStatusFilled(): Boolean {
    return this.status === ORDER_STATUS.FILLED;
  }
}