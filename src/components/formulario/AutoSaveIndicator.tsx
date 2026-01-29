'use client';

import { Save } from 'lucide-react';

export function AutoSaveIndicator() {
  // Simplified version - just shows a static message
  // The data is saved to localStorage automatically by zustand persist
  return (
    <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
      <Save className="w-5 h-5" />
      <span className="text-base">
        Sus datos se guardan automáticamente
      </span>
    </div>
  );
}
