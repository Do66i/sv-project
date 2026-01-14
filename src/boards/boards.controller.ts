import { Controller, Body, Get, Post, Logger, Param, Delete, Patch, UseGuards, ParseIntPipe, Query, } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards.model';
import { Board } from './boards.entity'; // 반드시 entity 파일이 존재해야 합니다!
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardStatusDto } from './dto/update-board-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';// 유저를 꺼내오는 편리한 도구

@Controller('boards')
export class BoardsController {
    private logger = new Logger('BoardsController');

    constructor(private boardsService: BoardsService) {}

    // 1. 전체 조회
    @Get()
    async getAllBoards(
        @Query('search') search: string,
    ): Promise<{ success: boolean; result: Board[] }> {
        // Promise와 async 추가
        this.logger.log('----- 전체 게시글 조회 요청 (GET) -----');

        if (search) {
            this.logger.log(`================= 검색어: ${search} 필터링 적용 `);
        }

        // await를 붙여야 Promise가 아닌 실제 Board[] 배열이 나옵니다.
        const result = await this.boardsService.getAllBoards(search);
        const success = result.length > 0;

        this.logger.log(`조회된 게시글 수: ${result.length}개`);
        this.logger.log('--------------------------------------');

        return {
            success: success,
            result,
        };
    }

    // 2. 게시글 생성
    @Post()
    @UseGuards(AuthGuard()) // 인증 가드 적용
    async createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User, // 작성자 정보도 함께 받기
    ): Promise<{ board: Board; message: string }> {
        this.logger.log(
            `----- 게시글 생성 요청 (User: ${user.username})(POST) -----`,
        );

        // await 추가
        const board = await this.boardsService.createBoard(
            createBoardDto,
            user,
        );

        this.logger.log(`생성 결과: ${JSON.stringify(board)}`);
        this.logger.log('--------------------------------------');
        return {
            board,
            message: `게시글이 성공적으로 생성되었습니다. ✅`,
        };
    }

    // 3. 게시글 삭제
    @Delete('/:id')
    @UseGuards(JwtAuthGuard) // 인증 가드 적용
    async deleteBoard(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User, // 현재 로그인한 유저 정보 가져오기
    ): Promise<{ success: boolean; message: string }> {
        this.logger.log(`----- 게시글 삭제 요청 (ID: ${id}) -----`);

        // deleteBoard가 async 함수이므로 await 추가
        await this.boardsService.deleteBoard(id, user);

        this.logger.log(`@@@@@@ user ????? ${JSON.stringify(user)}`);
        this.logger.log(`ID가 "${id}"인 게시글이 삭제되었습니다.`);
        this.logger.log('--------------------------------------');

        return {
            success: true,
            message: `ID가 "${id}"인 게시글이 성공적으로 삭제되었습니다. ✅`,
        };
    }

    // 4. 상태 수정
    @Patch('/:id/status')
    @UseGuards(AuthGuard()) // 인증 가드 적용
    async updateBoardStatus(
        @Param('id') id: number, // 파라미터 타입을 number로 변경
        @Body() updateBoardStatusDto: UpdateBoardStatusDto,
    ): Promise<{ success: boolean; message: string; board: Board }> {
        const { status } = updateBoardStatusDto;

        // await 추가
        const updatedBoard = await this.boardsService.patchBoardStatus(
            id,
            status,
        );

        return {
            success: true,
            message: `ID가 "${id}"인 게시글이 성공적으로 상태변경 되었습니다. ✅`,
            board: updatedBoard,
        };
    }

    // 5. 내가 쓴 게시글만 조회
    @Get('/my')
    @UseGuards(AuthGuard()) // 인증 가드 적용
    async getMyBoards(
        @GetUser() user: User, // 현재 로그인한 유저 정보 가져오기
    ): Promise<Board[]> {
        this.logger.log(
            `[My Boards] 유저 ${user.username}가 자신의 글 목록을 요청했습니다.`,
        );
        return this.boardsService.getMyBoards(user); // 새로운 서비스 함수 호출
    }
}
