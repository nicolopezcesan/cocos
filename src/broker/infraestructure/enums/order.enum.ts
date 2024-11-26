
export enum ORDER_STATUS {
  NEW = 'NEW',
  FILLED = 'FILLED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum ORDER_SIDE {
  BUY = 'BUY',
  SELL = 'SELL',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
}

export enum ORDER_TYPE {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}