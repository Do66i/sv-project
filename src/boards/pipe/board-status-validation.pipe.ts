import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../boards.model';

export class BoardStatusValidationPipe implements PipeTransform {
    readonly StatusOptions = [BoardStatus.PUBLIC, BoardStatus.PRIVATE];

    transform(value: any) {
        if (!value) throw new BadRequestException('상태값이 비었습니다 !');

        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(
                `"${value}" 는 올바른 상태값이 아닙니다!`,
            );
        }
        return value;
    }

    private isStatusValid(status: any) {
        return this.StatusOptions.indexOf(status) !== -1;
    }
}
