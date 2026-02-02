// API 경로 설정
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('comments')
@UseGuards(AuthGuard()) // 로그인이 필요한 기능임을 명시
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
      @Body() createCommentDto: CreateCommentDto,
      @GetUser()user:User // 로그인 한 정보 가져오기
  ) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(
      @Param('id') id: string,
      @GetUser() user: User // 로그인 한 정보 가져오기
  ) {
    return this.commentsService.remove(+id, user);
  }
}
