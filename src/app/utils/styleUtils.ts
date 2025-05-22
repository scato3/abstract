/**
 * 나이에 따른 색상 반환 함수
 * @param age 나이
 * @returns 색상 코드
 */
export const getAgeColor = (age: number): string => {
  return age > 30 ? "red" : "green";
};

/**
 * 다른 스타일 유틸리티 함수들을 추가할 수 있음
 */
