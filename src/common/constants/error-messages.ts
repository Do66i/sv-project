export const BOARD_ERROR_MESSAGES = {
    NOT_FOUND: (id: string) => `ID가 "${id}"인 게시글을 찾을 수 없습니다. 😭`,
    CREATE_FAILED: '게시글 생성 중 오류가 발생했습니다.',
    INVALID_STATUS: '올바른 게시글 상태가 아닙니다. (PUBLIC 또는 PRIVATE만 가능합니다) ❌',
};
