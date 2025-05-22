import { z } from "zod";

// 스텝1 스키마
export const step1Schema = z.object({
  name: z.string().min(2, "이름은 최소 2글자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 형식이 아닙니다"),
  phone: z.string().regex(/^01[0-9]{8,9}$/, "유효한 전화번호 형식이 아닙니다"),
  address: z.string().optional(),
  birthdate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "유효한 날짜를 입력해주세요"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "성별을 선택해주세요" }),
  }),
});

// 스텝2 스키마
export const step2Schema = z.object({
  occupation: z.string().min(1, "직업을 입력해주세요"),
  company: z.string().min(1, "회사명을 입력해주세요"),
  jobTitle: z.string().min(1, "직책을 입력해주세요"),
  experience: z.number().min(0, "경력을 입력해주세요"),
  skills: z.string().min(3, "보유 기술을 입력해주세요"),
  education: z.string().optional(),
});

// 스텝3 스키마
export const step3Schema = z.object({
  interests: z.string().min(3, "관심사를 입력해주세요"),
  hobbies: z.string().min(3, "취미를 입력해주세요"),
  favoriteColor: z.string().optional(),
  favoriteFood: z.string().optional(),
  favoriteMusic: z.string().optional(),
  bio: z.string().min(10, "자기소개는 최소 10글자 이상이어야 합니다"),
});

// 스텝4 스키마
export const step4Schema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "약관에 동의해주세요",
  }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: "개인정보 처리방침에 동의해주세요",
  }),
  agreeMarketing: z.boolean().optional(),
  comments: z.string().optional(),
  referral: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "none"], {
    errorMap: () => ({ message: "선호하는 연락 방법을 선택해주세요" }),
  }),
});

// 전체 스키마
export const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});

export type FormValues = z.infer<typeof formSchema>;
export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
