import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class PlayersValitdationParamPipe implements PipeTransform {
    
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException(`${metadata.data} must be informed`);
        }
        return value;
    }

}