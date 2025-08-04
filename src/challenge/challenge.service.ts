import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Challenge, Game } from './interface/challenge.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { PlayersService } from '../players/players.service';
import { CategoriesService } from '../categories/categories.service';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ReplyChallengeDto } from './dtos/reply-challenge.dto';
import { AddChallengeToGameDto } from './dtos/add-challenge-to-game.dto';

@Injectable()
export class ChallengeService {
    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('Game') private readonly gameModel: Model<Game>,
        private readonly playerService: PlayersService,
        private readonly categoryService: CategoriesService,
    ) { };

    private readonly logger = new Logger(ChallengeService.name)

    async createChallenge(dto: CreateChallengeDto): Promise<Challenge> {

        const players = await this.playerService.getPlayers();

        dto.players.map(playerDto => {
            const playerFilter = players.filter(player => player._id == playerDto._id);
            if (playerFilter.length == 0) {
                throw new BadRequestException(`The id ${playerDto._id} is not a player.`)
            };
        });

        const inviterIsPlayer = dto.players.filter(player => player._id == dto.inviter);
        this.logger.log(`Challenge inviter: ${JSON.stringify(inviterIsPlayer)}`)
        if (inviterIsPlayer.length == 0) {
            throw new BadRequestException(`The inviter need to be a game player`)
        };

        const categoryPlayer = await this.categoryService.getCategoryFromPlayer(dto.inviter);
        if (!categoryPlayer) {
            throw new BadRequestException(`The inveter need to be register in a category`)
        };

        const challengeCreated = new this.challengeModel(dto);
        challengeCreated.category = categoryPlayer.category;
        challengeCreated.dateHourChallenge = new Date();
        challengeCreated.status = ChallengeStatus.PENDING;

        this.logger.log(`Challenge created: ${JSON.stringify(challengeCreated)}`);

        return await challengeCreated.save()
    };

    async addChallengeToGame(_id: string, dto: AddChallengeToGameDto): Promise<void> {
        const findedChallenge = await this.challengeModel.findById(_id);
        if (!findedChallenge) {
            throw new NotFoundException(`Challenge ID ${_id} not founded`);
        };

        const filteredPlayer = findedChallenge.players.filter(player => player._id == dto.winner);
        this.logger.log(`Finded challenge: ${findedChallenge}`)
        this.logger.log(`Filtered player: ${filteredPlayer}`)

        if (filteredPlayer.length == 0) {
            throw new BadRequestException(`The winning player is not part of the challenge!`)
        };

        const createdGame = new this.gameModel(dto);

        createdGame.category = findedChallenge.category;
        createdGame.players = findedChallenge.players;
        const result = await createdGame.save();

        findedChallenge.status = ChallengeStatus.DONE;

        try {
            await this.challengeModel.findOneAndUpdate({ _id }, { $set: findedChallenge }).exec()
        } catch (error) {
            await this.challengeModel.deleteOne({ _id: result._id }).exec();
            throw new InternalServerErrorException('Error recording match');
        };
    };

    async getChallenges(): Promise<Challenge[]> {
        return await this.challengeModel
            .find()
            .populate('inviter')
            .populate('players')
            .populate('game')
            .exec();
    };

    async getChallengeByPlayer(_id: string): Promise<Pick<Challenge, '_id'>[]> {
        const challenges = await this.getChallenges();
        const filteredChallenges = challenges.filter(challenge =>
            challenge.players.filter(player => player._id == _id)
        );

        if (filteredChallenges.length == 0) {
            throw new BadRequestException(`The player ${_id} do not have challenges.`)
        };

        return filteredChallenges.map(challenge => ({ _id: challenge._id }))
    };

    async updateChallenge(_id: string, dto: UpdateChallengeDto): Promise<Challenge> {
        const findedChallenge = await this.challengeModel.findOneAndUpdate(
            { _id },
            { $set: dto }).exec();
        if (!findedChallenge) {
            throw new NotFoundException(`Challenge ID ${_id} not founded`);
        };
        return findedChallenge;
    };

    async replayChallenge(_id: string, dto: ReplyChallengeDto): Promise<void> {
        const findedChallenge = await this.challengeModel.findById(_id);
        if (!findedChallenge) {
            throw new NotFoundException(`Challenge ID ${_id} not founded`);
        };

        if (dto.status === ChallengeStatus.ACCEPTED || dto.status === ChallengeStatus.DENIED) {
            findedChallenge.dateHourReply = new Date();
            findedChallenge.status = dto.status;
        } else {
            throw new NotAcceptableException('You need reply the challenge');
        };

    }

    async deleteChallenge(_id: string): Promise<void> {
        const findedChallenge = await this.challengeModel.findById({ _id }).exec();
        if (!findedChallenge) {
            throw new NotFoundException(`Challenge ID ${_id} not founded`);
        };

        findedChallenge.status = ChallengeStatus.CANCELED;

        await this.challengeModel.findByIdAndUpdate(
            { _id },
            { $set: findedChallenge }).exec();
    };



}
