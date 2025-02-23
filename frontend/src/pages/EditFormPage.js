import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import { useLocation } from 'react-router-dom';

const EditFormPage = () => {
    const { formId } = useParams();
    const [formData, setFormData] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const navigate = useNavigate();
    
    const location = useLocation();
    const isReadOnly = location.state?.isReadOnly || false;
    
    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await axiosInstance.get(`/filledForms/${formId}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching form data:', error.response?.data || error.message);
                setSubmitError('Error loading form data');
                navigate('/');
            }
        };

        fetchFormData();
    }, [formId, navigate]);

    const handleAnswerChange = (index, value) => {
        if (isReadOnly) return; 
        setFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === index ? { ...q, answerValue: value } : q
            ),
        }));
    };

    const handleCheckboxChange = (index, option, checked) => {
        if (isReadOnly) return;
        setFormData((prev) => ({
            ...prev,
            questions: prev.questions.map((q, i) => {
                if (i === index) {
                    let currentAnswers = [];
                    try {
                        currentAnswers = q.answerValue ? JSON.parse(q.answerValue) : [];
                    } catch (e) {
                        currentAnswers = [];
                    }
                    if (checked) {
                        if (!currentAnswers.includes(option)) {
                            currentAnswers.push(option);
                        }
                    } else {
                        currentAnswers = currentAnswers.filter((ans) => ans !== option);
                    }
                    return { ...q, answerValue: JSON.stringify(currentAnswers) };
                }
                return q;
            }),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isReadOnly) return; 
        setSubmitError('');
        setSubmitSuccess('');
        try {
            await axiosInstance.put(`/filledForms/${formId}`, formData);
            setSubmitSuccess('Form updated successfully!');
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
            setSubmitError('Error submitting the form. Please try again.');
        }
    };

    if (!formData) return <div>Loading...</div>;

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <h1 className="mb-4 text-center">
                    {isReadOnly ? 'View Filled Form' : 'Edit Filled Form'}
                </h1>
                {submitError && <Alert variant="danger">{submitError}</Alert>}
                {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {formData.questions.map((question, index) => (
                        <Form.Group key={question.questionId} className="mb-3">
                            <Form.Label>{question.questionTextSnapshot}</Form.Label>

                            {question.questionType === 'single-line' && (
                                <Form.Control
                                    type="text"
                                    value={question.answerValue || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            )}

                            {question.questionType === 'multi-line' && (
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={question.answerValue || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    readOnly={isReadOnly}
                                />
                            )}

                            {question.questionType === 'dropdown' && (
                                <Form.Select
                                    value={question.answerValue || ''}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    disabled={isReadOnly}
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

                            {question.questionType === 'checkbox' && (
                                <div>
                                    {question.options.map((option, i) => {
                                        let currentAnswers = [];
                                        try {
                                            currentAnswers = question.answerValue
                                                ? JSON.parse(question.answerValue)
                                                : [];
                                        } catch (e) {
                                            currentAnswers = [];
                                        }
                                        return (
                                            <Form.Check
                                                key={i}
                                                type="checkbox"
                                                label={option}
                                                checked={currentAnswers.includes(option)}
                                                onChange={(e) =>
                                                    handleCheckboxChange(index, option, e.target.checked)
                                                }
                                                disabled={isReadOnly}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </Form.Group>
                    ))}
                    {!isReadOnly && (
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    )}
                </Form>
            </Card>
        </Container>
    );
};

export default EditFormPage;
