'use client';

import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Mobile: solo texto */}
      <div className="sm:hidden text-center py-4">
        <span className="text-xl font-medium text-foreground">
          Paso {currentStep} de {totalSteps}
        </span>
        <p className="text-base text-muted-foreground mt-1">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Desktop: barra completa */}
      <div className="hidden sm:block py-6">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {/* Línea izquierda */}
                  {index > 0 && (
                    <div
                      className={`flex-1 h-1 ${
                        isCompleted || isCurrent ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}

                  {/* Círculo del paso - mínimo 48px para área táctil */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base
                      transition-colors duration-200
                      ${isCompleted ? 'bg-green-600 text-white' : ''}
                      ${isCurrent ? 'bg-primary text-white ring-4 ring-primary/20' : ''}
                      ${isPending ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {isCompleted ? <Check className="w-6 h-6" /> : stepNumber}
                  </div>

                  {/* Línea derecha */}
                  {index < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>

                {/* Label del paso */}
                <span
                  className={`
                    mt-2 text-base text-center max-w-[120px]
                    ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'}
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
