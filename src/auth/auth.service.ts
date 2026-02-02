import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        // @InjectRepository를 통해 User 엔티티를 다루는 저장소(Repository)를 주입받습니다.
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    // 회원가입 기능
    async signUp(
        authCredentialsDto: AuthCredentialDto,
    ): Promise<{ success: boolean; message: string; user: User }> {
        const { username, password } = authCredentialsDto;

        // 비밀번호 암호화
        const salt = await bcrypt.genSalt(); // 솔트는 같은 비밀번호라도 암호화된 결과가 다르게 나오도록 추가하는 무작위 데이터입니다.
        // 비밀번호와 솔트를 합쳐서 해시(Hash)화 합니다.
        const hashedPassword = await bcrypt.hash(password, salt);

        // 1. 새로운 유저 객체 생성
        const user = this.userRepository.create({
            username,
            password: hashedPassword,
        });
        try {
            // 2. 유저 정보를 데이터베이스에 저장
            await this.userRepository.save(user);
            return {
                success: true,
                message: '회원가입이 성공적으로 완료되었습니다! 🎉',
                user,
            };
        } catch (err) {
            // 에러 코드 23505(Postgres) 혹은 1062(MySQL)는 '중복 데이터' 에러입니다.
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                throw new ConflictException('이미 존재하는 유저명입니다. 🧐');
            } else {
                // 그 외의 알 수 없는 에러는 우리가 직접 500 에러를 던져줍니다.
                throw new InternalServerErrorException(
                    '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😭',
                );
            }
        }
    }

    // 로그인 기능
    async signIn(
        authCredentialsDto: AuthCredentialDto,
    ): Promise<{ message: string; user: Partial<User>; accessToken: string }> {
        const { username, password } = authCredentialsDto;

        // 1. DB에서 해당 유저명을 가진 유저 탐색
        const user = await this.userRepository.findOne({
            where: { username },
            select: ['id', 'username', 'password'], // password를 포함하라고 직접 말해줘야 함!
        });

        // 2. 유저가 존재하고, 비밀번호가 일치하는지 확인
        // bcrypt.compare(입력비번, DB암호비번) -> 일치하면 true를 반환합니다.
        if (user && (await bcrypt.compare(password, user.password))) {
            // 유저명만 담은 페이로드(데이터 보따리)를 만듭니다.
            const payload = { username };
            // JwtService를 이용해 페이로드를 암호화하여 토큰을 생성
            const accessToken = await this.jwtService.sign(payload);

            // [수정] password만 따로 빼고, 나머지는 'rest'라는 이름에 담아줘
            const { password: _, ...userWithoutPassword } = user;

            return {
                message: '로그인 성공 ! 🔓',
                user: userWithoutPassword,
                accessToken,
            };
        } else {
            // 유저가 없거나 비번이 틀린 경우 보안을 위해 동일하게 "로그인 실패" 메시지를 보냅니다.
            throw new UnauthorizedException(
                '로그인 정보가 올바르지 않습니다. 🤷‍♂️',
            );
        }
    }

    async findUserById(id: number): Promise<User>{
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'username'], // password를 제외한 정보만 선택
        })

        if (!user) {
            throw new NotFoundException(`ID가 ${id}인 유저를 찾을 수 없어! 🧐`);
        }

        return user;
    }
}
