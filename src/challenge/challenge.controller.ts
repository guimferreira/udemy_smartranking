import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Challenge } from './interface/challenge.interface';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ReplyChallengeDto } from './dtos/reply-challenge.dto';
import { AddChallengeToGameDto } from './dtos/add-challenge-to-game.dto';

@Controller('api/v1/challenges')
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService
    ) { }

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(
        @Body() createChallengeDto: CreateChallengeDto
    ): Promise<Challenge> {
        return await this.challengeService.createChallenge(createChallengeDto);
    };

    @Post(':challenge/game')
    async addChallengeToGame(
        @Body(ValidationPipe) addChallengeToGame: AddChallengeToGameDto,
        @Param('challenge') _id: string): Promise<void> {
        await this.challengeService.addChallengeToGame(_id, addChallengeToGame);
    };

    @Get()
    async getChallenges(): Promise<Challenge[]> {
        return await this.challengeService.getChallenges();
    };

    @Get(':id')
    async getChallengeByPlayer(id: string): Promise<Pick<Challenge, '_id'>[]> {
        return await this.challengeService.getChallengeByPlayer(id)
    };

    @Patch(':id')
    async updateChallenge(
        @Param('id', ValidationPipe) id: string,
        @Body() updateChallengeDto: UpdateChallengeDto
    ): Promise<Challenge> {
        return await this.challengeService.updateChallenge(id, updateChallengeDto)
    };

    @Patch(':id')
    async replyChallenge(
        @Param('id', ValidationPipe) id: string,
        @Body() replyChallengeDto: ReplyChallengeDto
    ): Promise<void> {
        await this.challengeService.replayChallenge(id, replyChallengeDto)
    };

    @Delete(':id')
    async deleteChallenge(@Param('id', ValidationPipe) id: string): Promise<void> {
        await this.challengeService.deleteChallenge(id);
    }
}
