import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';

@Module({
  imports: [UsersModule, HotelsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
