"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, Step3Values } from "../lib/schema";
import { FormInput } from "./FormInput";
import { useFormContext } from "../contexts/FormContext";
import styles from "../styles/form.module.scss";

export const Step3Form = () => {
  const { formData, updateFormData, goToStep } = useFormContext();

  const methods = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      interests: formData.interests || "",
      hobbies: formData.hobbies || "",
      favoriteColor: formData.favoriteColor || "",
      favoriteFood: formData.favoriteFood || "",
      favoriteMusic: formData.favoriteMusic || "",
      bio: formData.bio || "",
    },
  });

  const onSubmit = (data: Step3Values) => {
    updateFormData(data);
    goToStep(4);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${styles.formContainer} ${styles.step3}`}
        noValidate
      >
        <h2 className={styles.formTitle}>관심사 및 취미</h2>

        <div className={styles.fieldDescription}>
          <p>
            <span className={styles.required}>*</span> 표시는 필수 입력
            항목입니다.
          </p>
        </div>

        <FormInput
          name="interests"
          label="관심사"
          placeholder="관심사를 입력하세요 (쉼표로 구분)"
          required
        />

        <FormInput
          name="hobbies"
          label="취미"
          placeholder="취미를 입력하세요 (쉼표로 구분)"
          required
        />

        <FormInput
          name="favoriteColor"
          label="좋아하는 색"
          placeholder="좋아하는 색을 입력하세요"
          optional
        />

        <FormInput
          name="favoriteFood"
          label="좋아하는 음식"
          placeholder="좋아하는 음식을 입력하세요"
          optional
        />

        <FormInput
          name="favoriteMusic"
          label="좋아하는 음악"
          placeholder="좋아하는 음악을 입력하세요"
          optional
        />

        <FormInput
          name="bio"
          label="자기소개"
          type="textarea"
          placeholder="자기소개를 입력하세요 (최소 10글자)"
          required
        />

        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => goToStep(2)}
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
