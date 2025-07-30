import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interface/category.interface';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ValidationParamPipe } from '../commom/pipes/validation-param.pipe';

@Controller('api/v1/categories')
export class CategoriesController {

    constructor(private readonly categoryService: CategoriesService) { };

    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ): Promise<void> {
        await this.categoryService.createCategory(createCategoryDto);
    };

    @Get()
    async getCategories(): Promise<Category[]> {
        return await this.categoryService.getCategories();
    }

    @Get(':category')
    async getCategoryByCat(
        @Param('category', ValidationParamPipe) category: string): Promise<Category> {
        return await this.categoryService.getCategoryByCat(category);
    };

    @Patch(':category')
    async updateCategory(
        @Param('category', ValidationParamPipe) category: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<void> {
        await this.categoryService.updateCategory(category, updateCategoryDto);
    };

    @Delete(':category')
    async deleteCategory(
        @Param('category', ValidationParamPipe) category: string): Promise<void> {
        await this.categoryService.deleteCategory(category);
    };

    @Post(':category/players/:idplayer')
    async addCategoryToPlayer(
        @Param() params: string[]): Promise<void> {
        await this.categoryService.addCategoryToPlayer(params);
    }
}
