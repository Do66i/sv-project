# 🚀 SV-PROJECT: NestJS 게시판 API

> **NestJS로 구축한 견고한 백엔드 시스템입니다.**
> 단순한 기능 구현을 넘어, 사용자 친화적인 에러 메시지와 철저한 데이터 검증을 지향합니다.

---

## ✨ 핵심 기능 (Key Features)

- **철저한 예외 처리**: `HttpExceptionFilter`를 통해 모든 에러를 일관된 한국어 메시지로 변환하여 응답합니다.
- **데이터 유효성 검사**: `class-validator`를 사용하여 잘못된 데이터가 들어오지 않도록 입구를 차단합니다.
- **실시간 로그 기록**: `Logger`를 활용하여 서버에서 일어나는 모든 요청과 응답 과정을 추적합니다.
- **고유 식별자 시스템**: `uuid` 라이브러리를 통해 각 게시글에 중복 없는 고유 ID를 부여합니다.

---

## 📂 프로젝트 구조 (Project Structure)

```text
src
├── main.ts                 # 애플리케이션 시작점 (필터/파이프 설정)
├── app.module.ts           # 루트 모듈
├── http-exception.filter.ts # 전역 에러 거름망 (한국어 에러 메시지 처리)
└── boards                  # 게시판 모듈
    ├── boards.module.ts
    ├── boards.controller.ts # 요청 처리 (안내원)
    ├── boards.service.ts    # 비즈니스 로직 (일꾼)
    ├── board.model.ts      # 게시글 데이터 정의
    └── dto                 # 데이터 전송 객체
        └── create-board.dto.ts
```

---

## 🛠 사용 기술 (Tech Stack)

<div align=left>
  <img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
</div>

---

## 🚦 시작하기 (Getting Started)

### 의존성 설치
```bash
$ npm install
```

### 서버 실행
```bash
# 개발 모드 (자동 재시작)
$ npm run start:dev
```

---

## 🛣 API 명세서 (Endpoints)

| 메서드 | 경로 | 설명 | 상태 |
| :--- | :--- | :--- | :--- |
| **GET** | `/boards` | 전체 게시글 조회 | ✅ 완료 |
| **POST** | `/boards` | 새 게시글 생성 | ✅ 완료 |
| **GET** | `/boards/:id` | 특정 게시글 상세 조회 | ✅ 완료 |
| **DELETE** | `/boards/:id` | 게시글 삭제 | 🔨 구현 중 |
| **PATCH** | `/boards/:id/status` | 게시글 상태 수정 | 📅 예정 |

---

## 🛡 에러 응답 예시 (Error Response)
주소를 틀리거나 데이터가 없을 때, 사용자에게 친절한 한국어 메시지를 반환합니다.

```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2025-12-22T09:00:00.000Z",
  "path": "/board",
  "message": "길을 잃으셨나요? 입력하신 주소를 다시 확인해 주세요! 🗺️"
}
```

---

## 👨‍💻 개발자 정보
- **작성자**: [Do66i](https://github.com/Do66i)
- **프로젝트**: SV-PROJECT
