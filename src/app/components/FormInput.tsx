"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styles from "../styles/form.module.scss";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  required?: boolean;
  optional?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = "text",
  placeholder = "",
  options = [],
  min,
  max,
  required = false,
  optional = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const renderLabel = () => {
    if (required) {
      return (
        <label htmlFor={name} className={styles.label}>
          {label} <span className={styles.required}>*</span>
        </label>
      );
    } else if (optional) {
      return (
        <label htmlFor={name} className={styles.label}>
          {label} <span className={styles.optional}>(선택)</span>
        </label>
      );
    }
    return (
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
    );
  };

  return (
    <div className={styles.formGroup}>
      {type !== "checkbox" && renderLabel()}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (type === "select") {
            return (
              <select
                id={name}
                {...field}
                className={`${styles.input} ${
                  errors[name] ? styles.error : ""
                }`}
              >
                <option value="">선택하세요</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          if (type === "textarea") {
            return (
              <textarea
                id={name}
                {...field}
                placeholder={placeholder}
                className={`${styles.input} ${styles.textarea} ${
                  errors[name] ? styles.error : ""
                }`}
              />
            );
          }

          if (type === "checkbox") {
            return (
              <div className={styles.checkboxContainer}>
                <input
                  id={name}
                  type="checkbox"
                  {...field}
                  checked={field.value}
                  value=""
                  className={styles.checkbox}
                />
                <label htmlFor={name} className={styles.label}>
                  {label}
                  {required && <span className={styles.required}> *</span>}
                  {optional && <span className={styles.optional}> (선택)</span>}
                </label>
              </div>
            );
          }

          if (type === "radio") {
            return (
              <div className={styles.radioGroup}>
                {options.map((option) => (
                  <div key={option.value} className={styles.radioItem}>
                    <input
                      id={`${name}-${option.value}`}
                      type="radio"
                      {...field}
                      value={option.value}
                      checked={field.value === option.value}
                      className={styles.radio}
                    />
                    <label
                      htmlFor={`${name}-${option.value}`}
                      className={styles.label}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <input
              id={name}
              type={type}
              {...field}
              placeholder={placeholder + (required ? " *" : "")}
              min={min}
              max={max}
              className={`${styles.input} ${errors[name] ? styles.error : ""}`}
              value={field.value || (type === "number" ? "" : field.value)}
              onChange={(e) => {
                const value =
                  type === "number"
                    ? e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                    : e.target.value;
                field.onChange(value);
              }}
            />
          );
        }}
      />

      {errors[name] && (
        <p className={styles.errorMessage}>{errors[name]?.message as string}</p>
      )}
    </div>
  );
};
