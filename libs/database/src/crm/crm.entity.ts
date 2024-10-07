import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'crm' })  // 여기에 컬렉션 이름 지정
export class CrmEntity {

  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true })
  description: string;
}