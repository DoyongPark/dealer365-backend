import { v4 as uuidv4 } from 'uuid';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<TModel, TEntity> {
  constructor(protected Model: Model<TModel>, protected Entity: ClassConstructor<TEntity>) {
  }  

  createUUID() {
    return uuidv4();
  }

  createObjectId() {
    return new Types.ObjectId().toString();
  }

  public static isInternalId(id: string) {
    const isValidMongoId = Types.ObjectId.isValid(id);
    if (!isValidMongoId) {
      return false;
    }

    return id === new Types.ObjectId(id).toString();
  }

  protected convertObjectIdToString(value: Types.ObjectId): string {
    return value.toString();
  }

  protected convertStringToObjectId(value: string): Types.ObjectId {
    return new Types.ObjectId(value);
  }

  async count(query: FilterQuery<TModel>, limit?: number): Promise<number> {
    return this.Model.countDocuments(query, {
      limit,
    });
  }

  async aggregate(query: any[], options: { readPreference?: 'secondaryPreferred' | 'primary' } = {}): Promise<any> {
    return await this.Model.aggregate(query).read(options.readPreference || 'primary');
  }

  async aggregateWithVirtuals(query: any[], options: { readPreference?: 'secondaryPreferred' | 'primary' } = {}): Promise<any> {
    return this.mapEntities(await this.Model.aggregate(query).read(options.readPreference || 'primary'));
  }

  async findOne(
    query: FilterQuery<TModel>,
    select?: ProjectionType<TEntity>,
    options: { readPreference?: 'secondaryPreferred' | 'primary'; query?: QueryOptions<TModel> } = {}
  ): Promise<TEntity | null> {
    const data = await this.Model.findOne(query, select, options.query).read(
      options.readPreference || 'primary'
    );
    if (!data) return null;

    return this.mapEntity(data.toObject());
  }

  async delete(query: FilterQuery<TModel>): Promise<{
    /** Indicates whether this writes result was acknowledged. If not, then all other members of this result will be undefined. */
    acknowledged: boolean;
    /** The number of documents that were deleted */
    deletedCount: number;
  }> {
    return await this.Model.deleteMany(query);
  }

  async find(
    query: FilterQuery<TModel>,
    select: ProjectionType<TEntity> = '',
    options: { limit?: number; sort?: any; skip?: number } = {}
  ): Promise<TEntity[]> {
    const data = await this.Model.find(query, select, {
      sort: options.sort || null,
    })
      .skip(options.skip as number)
      .limit(options.limit as number)
      //.lean() // TBD : https://waservice.inventis.co.kr/browse/D3API-309
      .exec();

    return this.mapEntities(data);
  }

  async findAll(options: { limit?: number; sort?: any; skip?: number, search?: any } = {}): Promise<TEntity[]> {
    const data = await this.Model.find()
      .skip(options.skip as number)
      .limit(options.limit as number)
      //.lean() // TBD : https://waservice.inventis.co.kr/browse/D3API-309
      .exec();

    return this.mapEntities(data);
  }

  async create(data: FilterQuery<TModel>, options: IOptions = {}): Promise<TEntity> {
    const newEntity = new this.Model(data);

    const saveOptions = options?.writeConcern ? { w: options?.writeConcern } : {};

    const saved = await newEntity.save(saveOptions);

    return this.mapEntity(saved);
  }

  // async insertMany(
  //   data: FilterQuery<TModel>[],
  //   ordered = false
  // ): Promise<{ acknowledged: boolean; insertedCount: number; insertedIds: Types.ObjectId[] }> {
  //   const result = await this.Model.insertMany(data, { ordered });
   

  //   const insertedIds = result.map((inserted) => inserted._id);

  //   return {
  //     acknowledged: true,
  //     insertedCount: result.length,
  //     insertedIds,
  //   };
  // }

  async update(
    query: FilterQuery<TModel>,
    updateBody: UpdateQuery<TModel>
  ): Promise<{
    matched: number;
    modified: number;
  }> {
    const saved = await this.Model.updateMany(query, updateBody, {
      multi: true,
    });

    return {
      matched: saved.matchedCount,
      modified: saved.modifiedCount,
    };
  }

  async updateOne(
    query: FilterQuery<TModel>,
    updateBody: UpdateQuery<TModel>,
    option?: any
  ): Promise<{
    matched: number;
    modified: number;
  }> {
    const saved = await this.Model.updateOne(query, updateBody, option);
    return {
      matched: saved.matchedCount,
      modified: saved.modifiedCount,
    };
  }

  
  async findByIdAndUpdate(
    id: string,
    updateBody: UpdateQuery<TModel>,
    options: QueryOptions<TModel> | null = { new: true, useFindAndModify: false }
  ): Promise<TEntity | null> {
    const saved = await this.Model.findByIdAndUpdate(id, updateBody, options);
    if (!saved) return null;
    return this.mapEntity(saved.toObject());;
  }

  async upsertMany(data: (FilterQuery<TModel>)[]) {
    const promises = data.map((entry) => this.Model.findOneAndUpdate(entry, entry, { upsert: true }));

    return await Promise.all(promises);
  }

  async bulkWrite(bulkOperations: any, ordered = false): Promise<any> {
    return await this.Model.bulkWrite(bulkOperations, { ordered });
  }

  protected mapEntity<TData>(data: TData): TData extends null ? null : TEntity {
    return plainToInstance(this.Entity, JSON.parse(JSON.stringify(data))) as any;
  }

  protected mapEntities(data: any): TEntity[] {
    return plainToInstance<TEntity, TEntity[]>(this.Entity, JSON.parse(JSON.stringify(data)));
  }

  protected mapTargetEntities<T_TargetEntity>(cls: new () => T_TargetEntity, data: any): T_TargetEntity[] {
    return plainToInstance<T_TargetEntity, T_TargetEntity[]>(cls, JSON.parse(JSON.stringify(data)));
  }
}

interface IOptions {
  writeConcern?: number | 'majority';
}
