"use client";

import React from "react";
import { useFormContext } from "../contexts/FormContext";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { Step3Form } from "./Step3Form";
import { Step4Form } from "./Step4Form";
import styles from "../styles/multistep.module.scss";

const StepIndicator = ({
  number,
  label,
  isActive,
  isComplete,
}: {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}) => {
  let stepClass = styles.inactive;

  if (isActive) {
    stepClass = styles[`step${number}`];
  } else if (isComplete) {
    stepClass = styles.complete;
  }

  return (
    <div className={`${styles.stepItem} ${stepClass}`}>
      <div className={styles.stepCircle}>
        {isComplete ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          number
        )}
      </div>
      <span className={styles.stepLabel}>{label}</span>
    </div>
  );
};

export const MultiStepForm = () => {
  const { currentStep, stepIndicatorProps } = useFormContext();

  const stepComponents = {
    1: <Step1Form />,
    2: <Step2Form />,
    3: <Step3Form />,
    4: <Step4Form />,
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        {stepIndicatorProps.steps.map((step) => (
          <StepIndicator
            key={step.number}
            number={step.number}
            label={step.label}
            isActive={step.isActive}
            isComplete={step.isComplete}
          />
        ))}
      </div>

      <div
        className={`${styles.progressBar} ${styles[`step${currentStep}`]}`}
      />

      <div className={styles.formContent}>
        {stepComponents[currentStep as keyof typeof stepComponents]}
      </div>
    </div>
  );
};
