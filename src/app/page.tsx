"use client";

import { FormProvider } from "./contexts/FormContext";
import { MultiStepForm } from "./components/MultiStepForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <FormProvider>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            리액트 훅폼 예제
          </h1>
          <MultiStepForm />
        </div>
      </FormProvider>
    </main>
  );
}
