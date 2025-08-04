import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interface/challenge.schema';
import { PlayersModule } from '../players/players.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    PlayersModule,
    CategoriesModule],
  providers: [ChallengeService],
  controllers: [ChallengeController],
  exports: [ChallengeService]
})
export class ChallengeModule { }
