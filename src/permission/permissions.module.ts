import { Global, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Global()
@Module({
  exports: [PermissionsService],
  providers: [PermissionsService]
})

export class PermissionsModule {}