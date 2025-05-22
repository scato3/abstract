import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "API 에러가 발생했습니다",
      error: "Server Error",
    },
    { status: 500 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      message: "요청 처리 중 오류가 발생했습니다",
      error: "Bad Request",
    },
    { status: 400 }
  );
}
