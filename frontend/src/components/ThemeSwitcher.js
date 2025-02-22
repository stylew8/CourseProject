import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ThemeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('isDarkMode');
        if (storedTheme !== null) {
            const isDark = storedTheme === 'true';
            setIsDarkMode(isDark);
            document.body.classList.toggle('dark-mode', isDark);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('isDarkMode', newTheme);
        document.body.classList.toggle('dark-mode', newTheme);
    };

    return (
        <Button variant={isDarkMode ? 'light' : 'dark'} onClick={toggleTheme}>
            {isDarkMode ? 'Light' : 'Dark'}
        </Button>
    );
};

export default ThemeSwitcher;
