import { BaseCreateEntity } from "./base.create.entity";

export class BaseCreateUpdateEntity extends BaseCreateEntity {
  updatedDateTimeUTC?: Date;
  updaterUserId?: string;
  updaterUserName?: string;
}
