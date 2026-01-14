export interface Board {
  id: string;
  title: string;
  description: string;
  status: BoardStatus; // 게시글 공개 여부 (공개/비공개)
}

export enum BoardStatus {
  PUBLIC = 'PUBLIC', // 공개
  PRIVATE = 'PRIVATE', // 비공개
}
