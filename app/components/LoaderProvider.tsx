'use client';
import React from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:bg-gray-900">
      {children}
      <Next13ProgressBar height="4px" color="#0D47A1" options={{ showSpinner: true }} showOnShallow />
    </div>
  );
};

export default Providers;