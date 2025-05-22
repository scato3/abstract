"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, Step2Values } from "../lib/schema";
import { FormInput } from "./FormInput";
import { useFormContext } from "../contexts/FormContext";
import styles from "../styles/form.module.scss";

export const Step2Form = () => {
  const { formData, updateFormData, goToStep } = useFormContext();

  const methods = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      occupation: formData.occupation || "",
      company: formData.company || "",
      jobTitle: formData.jobTitle || "",
      experience: formData.experience || 0,
      skills: formData.skills || "",
      education: formData.education || "",
    },
  });

  const onSubmit = (data: Step2Values) => {
    updateFormData(data);
    goToStep(3);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${styles.formContainer} ${styles.step2}`}
        noValidate
      >
        <h2 className={styles.formTitle}>직업 정보</h2>

        <div className={styles.fieldDescription}>
          <p>
            <span className={styles.required}>*</span> 표시는 필수 입력
            항목입니다.
          </p>
        </div>

        <FormInput
          name="occupation"
          label="직업"
          placeholder="직업을 입력하세요"
          required
        />

        <FormInput
          name="company"
          label="회사명"
          placeholder="회사명을 입력하세요"
          required
        />

        <FormInput
          name="jobTitle"
          label="직책"
          placeholder="직책을 입력하세요"
          required
        />

        <FormInput
          name="experience"
          label="경력 (년)"
          type="number"
          min={0}
          required
        />

        <FormInput
          name="skills"
          label="보유 기술"
          placeholder="보유 기술을 입력하세요 (쉼표로 구분)"
          required
        />

        <FormInput
          name="education"
          label="최종 학력"
          placeholder="최종 학력을 입력하세요"
          optional
        />

        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={styles.buttonPrevious}
          >
            이전 단계
          </button>
          <button type="submit" className={styles.buttonNext}>
            다음 단계
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
