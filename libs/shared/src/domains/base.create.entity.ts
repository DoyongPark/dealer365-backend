import { SystemSourceEnum } from "../types/system.source.enums";
import { BaseEntity } from "./base.entity";

export class BaseCreateEntity extends BaseEntity {
  systemSourceEnum: SystemSourceEnum = SystemSourceEnum.Dealer365;
  createdDateTimeUTC: Date;
  creatorUserId: string;
  creatorUserName: string;
}
