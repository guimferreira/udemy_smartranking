import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayersValitdationParamPipe } from './pipes/players-validation-param.pipe';

@Controller('api/v1/players')
export class PlayersController {
    constructor(private readonly playerService: PlayersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto
    ): Promise<void> {
        await this.playerService.createPlayer(createPlayerDto);
    }

    @Get()
    async getPlayers(): Promise<Player[]> {
        return await this.playerService.getPlayers();
    };

    @Get(':email')
    async getPlayerByEmail(
        @Param('email', PlayersValitdationParamPipe) email: string): Promise<Player> {
        return await this.playerService.getPlayerByEmail(email);
    };

    @Patch(':email')
    async updatePlayer(
        @Param('email', PlayersValitdationParamPipe) email: string,
        @Body() updatePlayerDto: UpdatePlayerDto,
    ): Promise<void> {
        await this.playerService.updatePlayer(email, updatePlayerDto);
    }

    @Delete(':email')
    async deletePlayer(
        @Param('email', PlayersValitdationParamPipe) email: string): Promise<void> {
        await this.playerService.deletePlayerByEmail(email);
    };

}
