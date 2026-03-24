import React from 'react';


export const useComponentTheme = () => {
    const [mode, setMode] = React.useState<'dark' | 'light'>('light');
    const [color, setColor] = React.useState('sky');
    const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
    const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
    return { mode, color, setColor, toggleMode, textColor };
}
