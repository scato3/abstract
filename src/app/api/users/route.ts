import { NextResponse } from "next/server";

// 가짜 사용자 데이터
const users = [
  { id: 1, name: "홍길동", age: 30, job: "개발자" },
  { id: 2, name: "김철수", age: 25, job: "디자이너" },
  { id: 3, name: "이영희", age: 28, job: "기획자" },
  { id: 4, name: "박지민", age: 32, job: "PM" },
  { id: 5, name: "최유리", age: 27, job: "데이터 분석가" },
];

export async function GET() {
  // 직접 사용자 배열 반환으로 단순화
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 실제로는 DB에 저장하는 로직이 들어갈 수 있음
    const newUser = {
      id: users.length + 1,
      ...body,
    };

    // 새 사용자 추가 (실제로는 DB에 저장)
    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "사용자 추가 중 오류가 발생했습니다.",
      },
      { status: 400 }
    );
  }
}
