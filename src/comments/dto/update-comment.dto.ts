import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

// CreateCommentDto에서 boardId는 제외(Omit)하고, 나머지 필드만 선택적(Partial)으로 가져옴
export class UpdateCommentDto extends PartialType(OmitType(CreateCommentDto, ['boardId'] as const)) {}
