"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema, Step4Values } from "../lib/schema";
import { FormInput } from "./FormInput";
import { useFormContext } from "../contexts/FormContext";
import styles from "../styles/form.module.scss";

export const Step4Form = () => {
  const { formData, updateFormData, goToStep, submitForm } = useFormContext();

  const methods = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      agreeTerms: formData.agreeTerms || false,
      agreePrivacy: formData.agreePrivacy || false,
      agreeMarketing: formData.agreeMarketing || false,
      comments: formData.comments || "",
      referral: formData.referral || "",
      preferredContact: formData.preferredContact || undefined,
    },
  });

  const onSubmit = async (data: Step4Values) => {
    updateFormData(data);
    await submitForm();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${styles.formContainer} ${styles.step4}`}
        noValidate
      >
        <h2 className={styles.formTitle}>약관 동의 및 최종 확인</h2>

        <div className={styles.fieldDescription}>
          <p>
            <span className={styles.required}>*</span> 표시는 필수 동의
            항목입니다.
          </p>
        </div>

        <FormInput
          name="agreeTerms"
          label="이용약관에 동의합니다"
          type="checkbox"
          required
        />

        <FormInput
          name="agreePrivacy"
          label="개인정보 처리방침에 동의합니다"
          type="checkbox"
          required
        />

        <FormInput
          name="agreeMarketing"
          label="마케팅 정보 수신에 동의합니다"
          type="checkbox"
          optional
        />

        <FormInput
          name="comments"
          label="추가 의견"
          type="textarea"
          placeholder="추가 의견을 입력하세요"
          optional
        />

        <FormInput
          name="referral"
          label="추천인"
          placeholder="추천인을 입력하세요"
          optional
        />

        <FormInput
          name="preferredContact"
          label="선호하는 연락 방법"
          type="radio"
          required
          options={[
            { value: "email", label: "이메일" },
            { value: "phone", label: "전화" },
            { value: "none", label: "연락 원치 않음" },
          ]}
        />

        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => goToStep(3)}
            className={styles.buttonPrevious}
          >
            이전 단계
          </button>
          <button type="submit" className={styles.buttonSubmit}>
            제출하기
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
