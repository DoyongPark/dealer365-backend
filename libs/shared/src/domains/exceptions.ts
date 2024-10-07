import { InternalServerErrorException } from '@nestjs/common';

/**When business error occur */
export class UserFriendlyException extends InternalServerErrorException  {}
