import { IsEnum, IsNotEmpty } from "class-validator";
import { ChallengeStatus } from "../enums/challenge-status.enum";

export class ReplyChallengeDto {

    @IsNotEmpty()
    @IsEnum(ChallengeStatus)
    status: ChallengeStatus;
}