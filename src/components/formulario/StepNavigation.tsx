'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface StepNavigationProps {
  onPrevious?: () => void;
  onNext: () => void;
  previousLabel?: string;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  showPrevious?: boolean;
}

export function StepNavigation({
  onPrevious,
  onNext,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
  isNextDisabled = false,
  isLoading = false,
  showPrevious = true,
}: StepNavigationProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-8 border-t border-border mt-8">
      {showPrevious && onPrevious ? (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="h-14 px-6 text-lg min-w-[120px]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}

      <Button
        type="submit"
        onClick={onNext}
        disabled={isNextDisabled || isLoading}
        className="h-14 px-8 text-lg min-w-[140px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
