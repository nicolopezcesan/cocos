// import { Inject, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Instrument } from '../entities/instrument';
// import { Repository } from 'typeorm';

// @Injectable()
// export class OperationRepository {

//   constructor(
//     @InjectRepository(Instrument)
//     private readonly instrumentRepository: Repository<Instrument>,
//   ) { }

//   async getOrders(getOrdersFilter: any): Promise<any> {
//     return this.instrumentRepository.find(getOrdersFilter);
//   }

// }
