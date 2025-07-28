import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel('Player') private readonly playerModel: Model<Player>
    ) { }

    async createPlayer(dto: CreatePlayerDto): Promise<void> {
        const { email } = dto;
        const findedPlayer = await this.playerModel.findOne({ email }).exec();
        if (!findedPlayer) {
            const createdPlayer = new this.playerModel(dto);
            await createdPlayer.save();
        } else {
            throw new ConflictException(`E-mail ${email} already registered`)
        }
    };

    async getPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    };

    async getPlayerByEmail(email: string): Promise<Player> {
        const findedPlayer = await this.playerModel.findOne({ email }).exec();
        if (!findedPlayer) {
            throw new NotFoundException(`Player with e-mail ${email} not founded`)
        }
        return findedPlayer;
    };

    async updatePlayer(email: string, dto: UpdatePlayerDto): Promise<void> {
        const findedPlayer = await this.playerModel.findOne({ email }).exec();
        if (!findedPlayer) {
            throw new NotFoundException(`Player with e-mail ${email} not founded`)
        }

        await this.playerModel.findOneAndUpdate(
            { email },
            { $set: dto }).exec();
    }


    async deletePlayerByEmail(email: string): Promise<void> {
        const result = await this.playerModel.findOneAndDelete({ email }).exec();
        if (!result) {
            throw new NotFoundException(`Player with email ${email} not found`);
        }
    };
}
