import { Document } from "mongoose";
import { Player } from "../../players/interfaces/player.interface";
import { ChallengeStatus } from "../enums/challenge-status.enum";

export interface Challenge extends Document {
    dateHourChallenge: Date,
    status: ChallengeStatus,
    dateHourInvite: Date,
    dateHourReply: Date,
    inviter: Player,
    category: string,
    players: Array<Player>,
    game: Game,
};

export interface Game extends Document {
    category: string,
    players: Array<Player>,
    winner: Player,
    result: Array<Result>,
};

export interface Result {
    set: string,
}