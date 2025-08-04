import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Player } from "../../players/interfaces/player.interface";

export class UpdateChallengeDto {

    @IsNotEmpty()
    @IsDateString()
    dateHourChallenge: Date;

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: Array<Player>;
}