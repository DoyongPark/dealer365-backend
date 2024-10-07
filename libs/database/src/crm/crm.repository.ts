import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { CrmEntity } from './crm.entity';

@Injectable()
export class CrmRepository extends BaseRepository<CrmEntity, CrmEntity> {

  constructor(@InjectModel(CrmEntity.name) private readonly model: Model<CrmEntity>) {
    super(model, CrmEntity);
  }

  async findByName(name: string): Promise<number> {
    return await this.model.countDocuments({ name: name }).exec();
  }

  async findById(id: string): Promise<CrmEntity | null> {
    return await this.model.findOne({ _id: id }).exec();
  }
}
