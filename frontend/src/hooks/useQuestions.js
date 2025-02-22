import { useState } from 'react';
import { singleLine } from '../utils/questionsTypes';

export const useQuestions = (initialQuestions = []) => {
    const [questions, setQuestions] = useState(initialQuestions);

    const addQuestion = () => {
        const newQuestion = {
            order: questions.length,
            type: singleLine, 
            text: '',
            description: '',
            showInTable: false,
            options: []
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        updated.forEach((q, i) => { q.order = i; });
        setQuestions(updated);
    };

    const moveQuestion = (dragIndex, hoverIndex) => {
        const updated = [...questions];
        const [movedQuestion] = updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, movedQuestion);
        updated.forEach((q, i) => { q.order = i; });
        setQuestions(updated);
    };

    const handleQuestionChange = (index, key, value) => {
        const updated = [...questions];
        updated[index][key] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        if(updatedQuestions[questionIndex]?.options[optionIndex]) {
            updatedQuestions[questionIndex].options[optionIndex].value = value;
            setQuestions(updatedQuestions);
        }
    };

    const addOptionToQuestion = (questionIndex) => {
        const updatedQuestions = [...questions];
        if(updatedQuestions[questionIndex]?.options?.length < 4) {
            const newOption = {
                id: Date.now(),
                order: updatedQuestions[questionIndex].options.length,
                value: ""
            };
            updatedQuestions[questionIndex].options.push(newOption);
            setQuestions(updatedQuestions);
        }
    };

    return {
        questions,
        setQuestions,
        addQuestion,
        removeQuestion,
        moveQuestion,
        handleQuestionChange,
        handleOptionChange,
        addOptionToQuestion
    };
};