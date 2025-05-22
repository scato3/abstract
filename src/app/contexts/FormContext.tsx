"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormValues } from "../lib/schema";
import { useModal } from "../providers/modal-provider";
import { useFormService } from "../query/formService";
// 타입 정의
export interface StepInfo {
  number: number;
  label: string;
}

export interface StepConfig {
  requiredFields: string[];
  name: string;
}

export interface StepIndicatorInfo extends StepInfo {
  isActive: boolean;
  isComplete: boolean;
}

export interface FormValidationResult {
  isValid: boolean;
  missingFields: {
    step: number;
    stepName: string;
    fields: string[];
  }[];
}

interface FormContextType {
  formData: Partial<FormValues>;
  currentStep: number;
  totalSteps: number;
  updateFormData: (data: Partial<FormValues>) => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  stepIndicatorProps: {
    steps: StepIndicatorInfo[];
    currentStep: number;
  };
  getIsStepValid: (step: number) => boolean;
  validateForm: () => FormValidationResult;
  submitForm: () => Promise<boolean>;
}

// 상수 분리
export const STEPS: StepInfo[] = [
  { number: 1, label: "기본 정보" },
  { number: 2, label: "직업 정보" },
  { number: 3, label: "관심사" },
  { number: 4, label: "약관 동의" },
];

export const STEP_CONFIG: Record<number, StepConfig> = {
  1: {
    requiredFields: ["name", "email", "phone"],
    name: "기본 정보",
  },
  2: {
    requiredFields: ["occupation", "company", "skills"],
    name: "직업 정보",
  },
  3: {
    requiredFields: ["interests", "hobbies", "bio"],
    name: "관심사 및 취미",
  },
  4: {
    requiredFields: ["agreeTerms", "agreePrivacy", "preferredContact"],
    name: "약관 동의",
  },
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showModal, hideAllModals } = useModal();
  const { mutate } = useFormService();
  const initialStep = parseInt(searchParams.get("step") || "1", 10);
  const totalSteps = Object.keys(STEP_CONFIG).length;

  const [formData, setFormData] = useState<Partial<FormValues>>({});
  const [currentStep, setCurrentStep] = useState<number>(
    initialStep >= 1 && initialStep <= totalSteps ? initialStep : 1
  );

  // 모달이 이미 표시 중인지 추적
  const isModalShownRef = useRef(false);

  // 특정 단계의 유효성 검사 함수
  const getIsStepValid = (step: number): boolean => {
    if (step < 1 || step > totalSteps) return false;
    if (step === 1) return true; // 첫 번째 단계는 항상 접근 가능

    const prevStep = step - 1;
    const requiredFields = STEP_CONFIG[prevStep].requiredFields;
    return requiredFields.every(
      (field) => !!formData[field as keyof FormValues]
    );
  };

  // 전체 폼 유효성 검사 함수
  const validateForm = (): FormValidationResult => {
    const result: FormValidationResult = {
      isValid: true,
      missingFields: [],
    };

    // 모든 단계 검사
    for (let step = 1; step <= totalSteps; step++) {
      const config = STEP_CONFIG[step];
      const missingFields = config.requiredFields.filter(
        (field) => !formData[field as keyof FormValues]
      );

      if (missingFields.length > 0) {
        result.isValid = false;
        result.missingFields.push({
          step,
          stepName: config.name,
          fields: missingFields,
        });
      }
    }

    return result;
  };

  // 폼 제출 함수
  const submitForm = async (): Promise<boolean> => {
    try {
      const currentFormData = { ...formData };

      return new Promise((resolve) => {
        mutate(currentFormData as FormValues, {
          onSuccess: (data) => {
            // API 응답의 success 필드를 확인하여 성공 여부 판단
            if (data?.success) {
              showModal(
                <div>
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: "16px",
                      color: "#10b981",
                    }}
                  >
                    제출 완료
                  </h3>
                  <p style={{ marginBottom: "20px" }}>
                    정보가 성공적으로 제출되었습니다.
                  </p>
                  <button
                    onClick={() => {
                      hideAllModals();
                      resetForm();
                    }}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      width: "100%",
                    }}
                  >
                    처음으로 돌아가기
                  </button>
                </div>
              );
              resolve(true);
            } else {
              // API는 성공했지만 응답 내용이 실패인 경우
              showModal(
                <div>
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: "16px",
                      color: "#ef4444",
                    }}
                  >
                    제출 실패
                  </h3>
                  <p style={{ marginBottom: "20px" }}>
                    {data?.message ||
                      "서버에서 오류가 발생했습니다. 다시 시도해주세요."}
                  </p>
                  <button
                    onClick={() => {
                      hideAllModals();
                    }}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      width: "100%",
                    }}
                  >
                    확인
                  </button>
                </div>
              );
              resolve(false);
            }
          },
          onError: (error) => {
            console.error("폼 제출 오류:", error);
            showModal(
              <div>
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "16px",
                    color: "#ef4444",
                  }}
                >
                  오류 발생
                </h3>
                <p style={{ marginBottom: "20px" }}>
                  제출 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
                <button
                  onClick={() => {
                    hideAllModals();
                  }}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    width: "100%",
                  }}
                >
                  확인
                </button>
              </div>
            );
            resolve(false);
          },
        });
      });
    } catch (error) {
      console.error("폼 제출 오류:", error);
      showModal(
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#ef4444" }}>
            오류 발생
          </h3>
          <p style={{ marginBottom: "20px" }}>
            제출 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
          <button
            onClick={() => {
              hideAllModals();
            }}
            style={{
              padding: "10px 16px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
            }}
          >
            확인
          </button>
        </div>
      );
      return false;
    }
  };

  useEffect(() => {
    isModalShownRef.current = false;

    if (currentStep === 1) return;

    if (!getIsStepValid(currentStep) && !isModalShownRef.current) {
      isModalShownRef.current = true;
      const prevStep = currentStep - 1;

      showModal(
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#3b82f6" }}>
            {STEP_CONFIG[prevStep].name} 필요
          </h3>
          <p style={{ marginBottom: "20px" }}>
            다음 단계로 진행하기 전에 {STEP_CONFIG[prevStep].name}를 먼저
            입력해주세요.
          </p>
          <button
            onClick={() => {
              hideAllModals();
              goToStep(prevStep);
            }}
            style={{
              padding: "10px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              width: "100%",
            }}
          >
            확인
          </button>
        </div>
      );
    }
  }, [currentStep, formData, showModal, hideAllModals]);

  const updateFormData = (data: Partial<FormValues>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      hideAllModals(); // 단계 이동 시 모든 모달 닫기
      setCurrentStep(step);

      // URL 쿼리 파라미터 업데이트
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step.toString());
      router.push(`?${params.toString()}`);
    }
  };

  const resetForm = () => {
    setFormData({});
    goToStep(1);
  };

  // 단계 인디케이터를 위한 데이터
  const stepIndicatorProps = {
    steps: STEPS.map((step) => ({
      ...step,
      isActive: currentStep === step.number,
      isComplete: currentStep > step.number,
    })),
    currentStep,
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        totalSteps,
        updateFormData,
        goToStep,
        resetForm,
        stepIndicatorProps,
        getIsStepValid,
        validateForm,
        submitForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
