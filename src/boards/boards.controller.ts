import { Controller, Body, Get, Post, Logger, Param, Delete, Patch, UseGuards, ParseIntPipe, Query, } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards.model';
import { Board } from './entities/boards.entity'; // 반드시 entity 파일이 존재해야 합니다!
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardStatusDto } from './dto/update-board-status.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { BoardStatusValidationPipe } from './pipe/board-status-validation.pipe';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Boards')
@ApiBearerAuth('accessToken')

@Controller('boards')
export class BoardsController {
    private logger = new Logger('BoardsController');
    constructor(private boardsService: BoardsService) {}

    @Get()
    @ApiOperation({ summary: '전체 게시글 조회', description: '검색어로 필터링하여 모든 게시글을 조회합니다.' })
    async getAllBoards(@Query('search') search: string) {
        this.logger.log('----- 전체 게시글 조회 요청 -----');
        const result = await this.boardsService.getAllBoards(search);
        return { success: result.length > 0, result };
    }

    @Post()
    @ApiOperation({ summary: '게시글 생성' })
    @UseGuards(AuthGuard())
    async createBoard(
        @Body() createBoardDto: CreateBoardDto, // @ApiBody 없이도 CreateBoardDto 구조가 노출됨
        @GetUser() user: User,
    ) {
        const board = await this.boardsService.createBoard(createBoardDto, user);
        return { board, message: '게시글이 성공적으로 생성되었습니다. ✅' };
    }

    @Delete('/:id')
    @ApiOperation({ summary: '게시글 삭제' })
    @UseGuards(JwtAuthGuard)
    async deleteBoard(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        await this.boardsService.deleteBoard(id, user);
        return { success: true, message: '성공적으로 삭제되었습니다. ✅' };
    }

    @Patch('/:id/status')
    @ApiOperation({ summary: '게시글 상태 수정' })
    @UseGuards(JwtAuthGuard)
    async updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus,
        @GetUser() user: User,
    ) {
        const updatedBoard = await this.boardsService.updateBoardStatus(id, status, user);
        return { success: true, board: updatedBoard };
    }

    @Patch('/:id')
    @ApiOperation({ summary: '게시글 수정' })
    @UseGuards(JwtAuthGuard)
    async updateBoard(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBoardDto: UpdateBoardDto,
        @GetUser() user: User,
    ) {
        const updatedBoard = await this.boardsService.updateBoard(id, updateBoardDto, user);
        return { success: true, board: updatedBoard };
    }

    @Get('/my')
    @ApiOperation({ summary: '내가 쓴 게시글 조회' })
    @UseGuards(AuthGuard())
    async getMyBoards(@GetUser() user: User) {
        return this.boardsService.getMyBoards(user);
    }
}
