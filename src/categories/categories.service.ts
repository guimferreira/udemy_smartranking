import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interface/category.interface';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from '../players/players.service';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playerService: PlayersService,
    ) { };

    async createCategory(dto: CreateCategoryDto): Promise<void> {
        const { category } = dto;
        const findedCategory = await this.categoryModel.findOne({ category }).exec();
        if (!findedCategory) {
            const createdCategory = new this.categoryModel(dto);
            await createdCategory.save();
        } else {
            throw new ConflictException(`Catgory ${category} already registered`)
        }
    };

    async getCategories(): Promise<Category[]> {
        return await this.categoryModel.find().exec();
    };

    async getCategoryByCat(category: string): Promise<Category> {
        const findedCategory = await this.categoryModel.findOne({ category }).populate('players').exec();
        if (!findedCategory) {
            throw new NotFoundException(`Category ${category} not founded`);
        }
        return findedCategory;
    };

    async updateCategory(category: string, dto: UpdateCategoryDto): Promise<void> {
        const findedCategory = await this.categoryModel.findOneAndUpdate(
            { category },
            { $set: dto }).exec();
        if (!findedCategory) {
            throw new NotFoundException(`Category ${category} not founded`);
        };
    };

    async deleteCategory(category: string): Promise<void> {
        const result = await this.categoryModel.findOneAndDelete({ category }).exec();
        if (!result) {
            throw new NotFoundException(`Category ${category} not founded`);
        }
    };

    async addCategoryToPlayer(params: string[]): Promise<void> {
        const category = params['category'];
        const idplayer = params['idplayer'];

        const findedCategory = await this.categoryModel.findOne({ category }).exec();
        if (!findedCategory) {
            throw new BadRequestException(`Category ${category} not exists`);
        };

        const playerAddedInCategory = await this.categoryModel.find({ category }).where('players').in(idplayer).exec();
        if (playerAddedInCategory.length > 0) {
            throw new BadRequestException(`Player with ID ${idplayer} already register in category ${category}`);
        };

        await this.playerService.getPlayerById(idplayer)

        findedCategory.players.push(idplayer);

        await this.categoryModel.findOneAndUpdate(
            { category },
            { $set: findedCategory }).exec()
    };

    async getCategoryFromPlayer(idPlayer: any): Promise<Category | null> {
        const players = await this.playerService.getPlayers();
        const playerFilter = players.filter(player => player._id == idPlayer);
        if (playerFilter.length == 0) {
            throw new BadRequestException(`The id ${idPlayer} is not a player`)
        };
        return await this.categoryModel.findOne().where('players').in(idPlayer).exec();
    };

}
