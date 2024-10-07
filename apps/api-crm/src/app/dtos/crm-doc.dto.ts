import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsOptional, IsString } from "class-validator";

export class CrmDocDto {
  @ApiProperty() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsDefined() @IsString() name: string;
  @ApiProperty() @IsOptional() @IsString() description?: string;
}
