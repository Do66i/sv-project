import { Controller, Body, Get, Post, Logger, Param, Delete } from '@nestjs/common'; // 데코레이터들 임포트
import { BoardsService } from './boards.service';
import type { Board } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards') // 1. 접속 경로 설정 : 이 클래스는  'localhost:3000/boards' 경로로 접속할 때 사용됨
export class BoardsController {
    // >>> logger 추가
    private logger = new Logger('BoardsController'); // 어떤 컨트롤러에서 로그가 발생했는지 쉽게 구분하기 위해 'BoardsController'라는 컨텍스트 이름을 지정

    // 2. 일꾼(Service) 소환 (의존성 주입)
    // 생성자(constructor) 안에서 일꾼을 정의하면, NestJS가 알아서 일꾼을 데려와 준다
    constructor(private boardsService: BoardsService) {}

    // 3. 게시글 전체 조회 (GET 요청 처리)
    @Get() // 'localhost:3000/boards' 경로로 GET 요청이 들어오면 이 함수가 실행됨
    getAllBoards(): Board[] {
        // 안내원이 직접 찾지 않고, 일꾼(this.boardsService)에게 시킨다
        this.logger.log('----- 전체 게시글 조회 요청 (GET) -----');

        const result = this.boardsService.getAllBoards();

        // result.length를 통해 현재 메모리(배열)에 게시글이 몇 개 있는지 확인합니다.
        this.logger.log(`조회된 게시글 수: ${result.length}개`);

        // 데이터 내용이 궁금하다면 JSON.stringify로 찍어볼 수 있습니다.
        this.logger.log(`조회 결과: ${JSON.stringify(result)}`);
        this.logger.log('--------------------------------------');

        return result;
    };

    // 4. 게시글 생성 (POST 요청 처리)
    @Post()
    createBoard(@Body() createBoardDto: CreateBoardDto): Board {
        this.logger.log('----- 게시글 생성 요청 (POST) -----');
        this.logger.log(`입력 데이터: ${JSON.stringify(createBoardDto)}`);

        // 이제 서비스에 DTO 하나만 넘겨도 에러가 나지 않습니다!
        const result = this.boardsService.createBoard(createBoardDto);

        this.logger.log(`생성 결과: ${JSON.stringify(result)}`);
        this.logger.log('-----------------------------------');

        return result;
    };

    // 5. 게시글 삭제
    @Delete('/:id')
    deleteBoard(@Param('id') id: string): { success: boolean; message: string } {
        this.logger.log(`----- 게시글 삭제 요청 (ID: ${id}) -----`);
        this.boardsService.deleteBoard(id);
        this.logger.log('-------------- 삭제완료 -----------');
        // 삭제 후 성공 메시지를 직접 반환합니다.
        return {
            success: true,
            message: `ID가 "${id}"인 게시글이 성공적으로 삭제되었습니다. ✅`,
        };

    }
}
