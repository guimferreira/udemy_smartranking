import { IsNotEmpty } from "class-validator";
import { Player } from "../../players/interfaces/player.interface";
import { Result } from "../interface/challenge.interface";

export class AddChallengeToGameDto {

    @IsNotEmpty()
    winner: Player;

    @IsNotEmpty()
    result: Array<Result>;
}