import clsx from 'clsx';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, isError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border px-4 py-2 outline-none transition-all',
          'focus:ring-2 focus:ring-primary-500',
          isError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300',
          className
        )}
        {...props}
      />
    );
  }
);
export default Input;