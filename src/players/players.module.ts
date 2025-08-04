import { Module } from "@nestjs/common";
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerSchema } from "./interfaces/player.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{name: 'Player', schema: PlayerSchema}])],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService]
})
export class PlayersModule {}