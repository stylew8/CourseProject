import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const ThemeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    };

    return (
        <Button variant={isDarkMode ? 'light' : 'dark'} onClick={toggleTheme}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
    );
};

export default ThemeSwitcher;