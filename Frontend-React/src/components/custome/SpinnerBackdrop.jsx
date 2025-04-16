import React from 'react';

const SpinnerBackdrop = ({ color = 'gray', size = 16 }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`w-${size} h-${size} border-4 border-t-4 border-t-${color}-200 border-${color}-800 rounded-full animate-spin`}
      />
    </div>
  );
};

export default SpinnerBackdrop;