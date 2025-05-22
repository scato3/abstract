"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, Step1Values } from "../lib/schema";
import { FormInput } from "./FormInput";
import { useFormContext } from "../contexts/FormContext";
import styles from "../styles/form.module.scss";

export const Step1Form = () => {
  const { formData, updateFormData, goToStep } = useFormContext();

  const methods = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
      birthdate: formData.birthdate || "",
      gender: formData.gender || undefined,
    },
  });

  const onSubmit = (data: Step1Values) => {
    updateFormData(data);
    goToStep(2);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${styles.formContainer} ${styles.step1}`}
        noValidate
      >
        <h2 className={styles.formTitle}>기본 정보</h2>

        <div className={styles.fieldDescription}>
          <p>
            <span className={styles.required}>*</span> 표시는 필수 입력
            항목입니다.
          </p>
        </div>

        <FormInput
          name="name"
          label="이름"
          placeholder="이름을 입력하세요"
          required
        />

        <FormInput
          name="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          required
        />

        <FormInput
          name="phone"
          label="전화번호"
          placeholder="01012345678"
          required
        />

        <FormInput
          name="address"
          label="주소"
          placeholder="주소를 입력하세요"
          optional
        />

        <FormInput name="birthdate" label="생년월일" type="date" required />

        <FormInput
          name="gender"
          label="성별"
          type="radio"
          required
          options={[
            { value: "male", label: "남성" },
            { value: "female", label: "여성" },
            { value: "other", label: "기타" },
          ]}
        />

        <div className={styles.buttonContainer}>
          <div></div>
          <button type="submit" className={styles.buttonNext}>
            다음 단계
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
