import React, { useEffect, useState } from 'react';

const CustomToast = ({ message, show, onClose, duration = 2000 }) => {
  const [showToast, setShowToast] = useState(show);

  // Update state when 'show' prop changes
  useEffect(() => {
    setShowToast(show);
  }, [show]);

  // Handle auto-close timer
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [showToast, onClose, duration]);

  if (!showToast) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
};

export default CustomToast;