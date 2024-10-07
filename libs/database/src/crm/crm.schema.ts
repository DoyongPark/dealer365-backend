import { SchemaFactory } from "@nestjs/mongoose";
import { CrmEntity } from "./crm.entity";

export const CrmSchema = SchemaFactory.createForClass(CrmEntity);
