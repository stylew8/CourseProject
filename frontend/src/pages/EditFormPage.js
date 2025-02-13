import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

const EditFormPage = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        // Имитация загрузки данных заполненной формы по formId
        const fetchedForm = {
            id: formId,
            user: 'John Doe',
            questions: [
                {
                    id: 1,
                    type: 'single-line',
                    text: 'What is your position?',
                    answer: 'Developer'
                },
                {
                    id: 2,
                    type: 'dropdown',
                    text: 'Select your experience level',
                    options: ['1', '2', '3', '4', '5'],
                    answer: '5'
                },
                {
                    id: 3,
                    type: 'checkbox',
                    text: 'Select your skills',
                    options: ['JavaScript', 'React', 'Node.js'],
                    answer: ['JavaScript', 'React']
                }
            ]
        };
        setFormData(fetchedForm);
    }, [formId]);

    // Обработчики изменения ответа остаются без изменений
    const handleAnswerChange = (index, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index].answer = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleCheckboxChange = (index, option) => {
        const updatedQuestions = [...formData.questions];
        const currentAnswers = updatedQuestions[index].answer || [];
        if (currentAnswers.includes(option)) {
            updatedQuestions[index].answer = currentAnswers.filter(ans => ans !== option);
        } else {
            updatedQuestions[index].answer = [...currentAnswers, option];
        }
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Form Data:', formData);
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <h1 className="mb-4 text-center">Edit Filled Form</h1>
                <Form onSubmit={handleSubmit}>
                    {formData.questions.map((question, index) => (
                        <Form.Group key={question.id} className="mb-3">
                            <Form.Label>{question.text}</Form.Label>

                            {question.type === 'single-line' && (
                                <Form.Control
                                    type="text"
                                    value={question.answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                />
                            )}

                            {question.type === 'dropdown' && (
                                <Form.Select
                                    value={question.answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {question.options.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Select>
                            )}

                            {question.type === 'checkbox' && (
                                <div>
                                    {question.options.map((option, i) => (
                                        <Form.Check
                                            key={i}
                                            type="checkbox"
                                            label={option}
                                            checked={question.answer.includes(option)}
                                            onChange={() => handleCheckboxChange(index, option)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Form.Group>
                    ))}
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default EditFormPage;
