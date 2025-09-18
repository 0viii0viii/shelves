export const TODO_MESSAGES = {
  ADD_SUCCESS: "할 일이 추가되었습니다.",
  DELETE_SUCCESS: "할 일이 삭제되었습니다.",
  UPDATE_SUCCESS: "할 일이 수정되었습니다.",
  LOAD_ERROR: "할 일 목록을 불러오는데 실패했습니다.",
  ADD_ERROR: "할 일 추가에 실패했습니다.",
  DELETE_ERROR: "할 일 삭제에 실패했습니다.",
  UPDATE_ERROR: "할 일 수정에 실패했습니다.",
  TOGGLE_ERROR: "할 일 상태 변경에 실패했습니다.",
  NOT_FOUND: "할 일을 찾을 수 없습니다.",
  EMPTY_INPUT: "할 일을 입력하세요.",
  LOADING: "할 일 목록을 불러오는 중...",
  EMPTY_STATE: "아직 할 일이 없습니다.",
  EMPTY_STATE_SUBTITLE: "위에서 새로운 할 일을 추가해보세요!",
} as const;

export const TODO_TOAST_DURATION = {
  SUCCESS: 1000,
  ERROR: 2000,
} as const;
