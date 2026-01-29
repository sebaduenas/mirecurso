'use client';

import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile: Modern pill design */}
      <div className="sm:hidden py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-foreground">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-base font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-base text-muted-foreground mt-2">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Desktop: Modern stepper */}
      <div className="hidden sm:block py-6">
        <div className="flex items-center justify-between relative">
          {/* Progress line background */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full mx-12" />

          {/* Progress line fill */}
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full mx-12 transition-all duration-500 ease-out"
            style={{ width: `calc(${progressPercentage}% - 6rem)` }}
          />

          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center flex-1 relative z-10">
                {/* Círculo del paso */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300 ease-out
                    ${isCompleted ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30' : ''}
                    ${isCurrent ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-110' : ''}
                    ${isPending ? 'bg-white border-2 border-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-6 h-6" strokeWidth={3} /> : stepNumber}
                </div>

                {/* Label del paso */}
                <span
                  className={`
                    mt-3 text-base text-center max-w-[100px] transition-all duration-300
                    ${isCompleted ? 'text-emerald-600 font-medium' : ''}
                    ${isCurrent ? 'text-primary font-bold' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
