import * as React from 'react';
import Input, { InputProps } from '@/components/atoms/Input/Input';

interface FormFieldProps extends InputProps {
    label: string;
    error?: string;
}

export const FormField= React.forwardRef<HTMLInputElement, FormFieldProps> (({ label, error, ...props }, ref) => {
    return (
        <div className='flex flex-col gap-1.5 w-full'>
            <label className='text-sm font-medium text-gray-700'>{label}</label>
            <Input ref={ref} isError={!!error} {...props} />
            {error && <span className='text-xs text-red-500'>{error}</span>}
        </div>
    );
});