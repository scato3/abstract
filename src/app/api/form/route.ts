import { NextResponse } from "next/server";
import { formSchema } from "@/app/lib/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod 스키마 검증
    const result = formSchema.safeParse(body);

    if (!result.success) {
      // 유효성 검사 실패 시 에러 필드 추출
      const errors = result.error.format();

      return NextResponse.json(
        {
          success: false,
          message: "필수 필드가 비어있습니다",
          errors,
        },
        { status: 400 }
      );
    }

    // 여기서 실제 DB 저장이나 다른 처리를 할 수 있음

    return NextResponse.json(
      {
        success: true,
        message: "폼이 성공적으로 제출되었습니다",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}
