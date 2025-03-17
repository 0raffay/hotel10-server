import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [DatabaseModule, UsersModule, HotelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
