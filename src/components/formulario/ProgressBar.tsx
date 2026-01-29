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
      {/* Mobile: Pill design cálido */}
      <div className="sm:hidden py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-foreground">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-base font-semibold text-primary bg-orange-50 px-4 py-1.5 rounded-full border border-primary/20">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-base text-muted-foreground mt-2 font-medium">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Desktop: Stepper cálido */}
      <div className="hidden sm:block py-6 overflow-x-auto">
        <div className="flex items-start justify-between relative min-w-[640px]">
          {/* Progress line background */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full" />

          {/* Progress line fill cálido */}
          <div
            className="absolute top-6 left-6 h-1 bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `calc(${progressPercentage}% * (100% - 48px) / 100)` }}
          />

          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center w-[90px] relative z-10">
                {/* Círculo del paso */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300 ease-out shrink-0
                    ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : ''}
                    ${isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20 scale-110' : ''}
                    ${isPending ? 'bg-white border-2 border-border text-muted-foreground hover:border-primary/40' : ''}
                  `}
                >
                  {isCompleted ? <Check className="w-6 h-6" strokeWidth={3} /> : stepNumber}
                </div>

                {/* Label del paso */}
                <span
                  className={`
                    mt-3 text-sm text-center leading-tight transition-all duration-300
                    ${isCompleted ? 'text-emerald-600 font-semibold' : ''}
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
