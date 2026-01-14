# 🏗️ Project Architecture & Directory Structure

이 문서는 NestJS 게시판 프로젝트의 전체 폴더 구조와 각 구성 요소의 역할을 설명합니다.

---

## 📂 src (Source Code)

### 🚀 Core Files
- **main.ts**: 애플리케이션의 진입점. 전역 파이프(ValidationPipe), 예외 필터, 미들웨어 및 포트 설정을 담당합니다.
- **app.module.ts**: 프로젝트의 루트 모듈로, `AuthModule`, `BoardsModule` 등 모든 도메인 모듈을 결합합니다.

---

### 🔐 Auth Module (인증/인가)
사용자 식별과 보안을 담당하는 모듈입니다.
- **auth.controller.ts**: 회원가입 및 로그인 API의 엔드포인트를 관리합니다.
- **auth.service.ts**: 비즈니스 로직 처리 (비밀번호 암호화 및 JWT 토큰 발행).
- **user.entity.ts**: 데이터베이스의 `User` 테이블 스키마 정의.
- **jwt.strategy.ts**: Passport를 사용하여 유효한 토큰인지 검증하는 로직.
- **jwt-auth.guard.ts**: 인증 실패 시 상세한 커스텀 에러 메시지를 반환하는 보호막.
- **get-user.decorator.ts**: 컨트롤러에서 로그인된 유저 정보를 편리하게 추출하기 위한 커스텀 데코레이터.
- **dto/auth-credential.dto.ts**: 회원가입/로그인 시 입력 데이터의 유효성 검사 규격.

---

### 📋 Boards Module (게시판 도메인)
게시글의 생성, 조회, 수정, 삭제(CRUD)를 담당하는 핵심 도메인입니다.
- **boards.controller.ts**: 게시글 관련 요청을 처리하며, 인증 가드를 통해 접근을 제어합니다.
- **boards.service.ts**: 검색 필터링, 본인 글 확인 로직, DB 연동 등 핵심 비즈니스 로직을 수행합니다.
- **boards.entity.ts**: `Board` 테이블 정의 및 `User` 엔티티와의 1:N 관계 설정.
- **boards.model.ts**: 게시글의 상태(Status) 등을 정의하는 인터페이스 및 모델.
- **dto/**:
    - `create-board.dto.ts`: 게시글 작성 시 규격.
    - `update-board.dto.ts`: 제목 및 내용 수정 시 사용되는 선택적 데이터 규격.
    - `update-board-status.dto.ts`: 상태 값 변경 전용 규격.
- **pipe/board-status-validation.pipe.ts**: 입력된 상태 값이 유효한지 검사하는 커스텀 파이프.

---

### 🛠️ Common & Utils (공통)
- **common/filters/http-exception.filter.ts**: 모든 HTTP 예외를 가로채 일관된 응답 포맷(JSON)으로 변환합니다.
- **common/constants/error-messages.ts**: 시스템 전체에서 사용되는 에러 메시지 상수를 통합 관리합니다.
- **logger/logger.middleware.ts**: 모든 HTTP 요청의 메서드, URL, 상태 코드 등을 기록하는 로깅 미들웨어입니다.

---

```
src/
├── app.module.ts              # 애플리케이션의 루트 모듈 (모든 모듈을 하나로 결합)
├── main.ts                    # 애플리케이션 진입점 (포트 설정, 전역 필터/파이프 등록)
│
├── auth/                      # [인증 모듈] 사용자 인증 및 보안 관련
│   ├── dto/
│   │   └── auth-credential.dto.ts # 회원가입 및 로그인 시 데이터 검증 규격
│   ├── auth.controller.ts     # 회원가입, 로그인 API 라우팅
│   ├── auth.service.ts        # 비밀번호 해싱(bcrypt), JWT 토큰 생성 로직
│   ├── user.entity.ts         # DB의 User 테이블 구조 정의
│   ├── jwt.strategy.ts        # Passport-JWT를 이용한 토큰 검증 로직
│   ├── jwt-auth.guard.ts      # 인증 에러 시 상세 메시지를 처리하는 커스텀 가드
│   └── get-user.decorator.ts  # 요청(Request)에서 유저 객체만 뽑아내는 커스텀 데코레이터
│
├── boards/                    # [게시판 모듈] 게시글 CRUD 및 비즈니스 로직
│   ├── dto/
│   │   ├── create-board.dto.ts      # 게시글 생성용 규격
│   │   ├── update-board.dto.ts       # 제목/내용 수정용 규격
│   │   └── update-board-status.dto.ts # 상태 변경 전용 규격
│   ├── pipe/
│   │   └── board-status-validation.pipe.ts # 상태값(PUBLIC/PRIVATE) 유효성 검사기
│   ├── boards.controller.ts   # 게시글 관련 API 라우팅 (Guard 적용)
│   ├── boards.service.ts      # 게시글 검색, 권한 체크, DB 처리 핵심 로직
│   ├── boards.entity.ts       # DB의 Board 테이블 구조 정의 (User와 1:N 관계)
│   └── boards.model.ts        # (인터페이스/모델 정의)
│
├── common/                    # [공통 모듈] 전역적으로 재사용되는 코드
│   ├── filters/
│   │   └── http-exception.filter.ts # 에러 발생 시 응답 형식을 통일해주는 예외 필터
│   └── constants/
│       └── error-messages.ts  # 에러 메시지 등 상수를 관리하는 파일
│
└── logger/                    # [로깅 모듈] 시스템 로그 관리
└── logger.middleware.ts   # 들어오는 모든 HTTP 요청을 기록하는 미들웨어
```
