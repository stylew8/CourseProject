// src/pages/TemplatePage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Tabs, Tab, Card, ListGroup, Table, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';

const TemplatePage = () => {
    const { id } = useParams(); // шаблонный id, например /template/:id
    const navigate = useNavigate();

    const [template, setTemplate] = useState(null);
    const [filledForms, setFilledForms] = useState([]);
    // Для заполнения формы создаём объект ответов: { [questionId]: answer }
    const [answers, setAnswers] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    // Запрос шаблона и заполненных форм с backend
    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axiosInstance.get(`/templates/public/${id}`);
                setTemplate(response.data);
            } catch (error) {
                console.error('Error fetching template:', error.response?.data || error.message);
            }
        };

        const fetchFilledForms = async () => {
            try {
                // Предполагается, что на сервере есть endpoint для получения заполненных форм данного шаблона
                const response = await axiosInstance.get(`/templates/${id}/filledForms`);
                setFilledForms(response.data);
            } catch (error) {
                console.error('Error fetching filled forms:', error.response?.data || error.message);
            }
        };

        fetchTemplate();
        fetchFilledForms();
    }, [id]);

    // Обработчик изменения ответа
    const handleAnswerChange = (question, value) => {
        setAnswers(prev => ({ ...prev, [question.id]: value }));
    };

    // Обработчик для checkbox (множественный выбор)
    const handleCheckboxChange = (question, optionValue, checked) => {
        setAnswers(prev => {
            const prevArr = Array.isArray(prev[question.id]) ? prev[question.id] : [];
            if (checked) {
                return { ...prev, [question.id]: [...prevArr, optionValue] };
            } else {
                return { ...prev, [question.id]: prevArr.filter(val => val !== optionValue) };
            }
        });
    };

    // Функция рендеринга поля ввода для вопроса
    const renderQuestionInput = (q) => {
        switch (q.type) {
            case 'single-line':
                return (
                    <Form.Control
                        type="text"
                        placeholder="Your answer"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q, e.target.value)}
                    />
                );
            case 'multi-line':
                return (
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Your answer"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q, e.target.value)}
                    />
                );
            case 'dropdown':
                return (
                    <Form.Select
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q, e.target.value)}
                    >
                        <option value="" disabled>
                            Select an option
                        </option>
                        {q.options &&
                            q.options.map((opt) => (
                                <option key={opt.id} value={opt.value}>
                                    {opt.value}
                                </option>
                            ))}
                    </Form.Select>
                );
            case 'checkbox':
                return (
                    <div>
                        {q.options &&
                            q.options.map((opt) => (
                                <Form.Check
                                    key={opt.id}
                                    type="checkbox"
                                    label={opt.value}
                                    checked={
                                        Array.isArray(answers[q.id]) &&
                                        answers[q.id].includes(opt.value)
                                    }
                                    onChange={(e) =>
                                        handleCheckboxChange(q, opt.value, e.target.checked)
                                    }
                                />
                            ))}
                    </div>
                );
            default:
                return (
                    <Form.Control
                        type="text"
                        placeholder="Your answer"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q, e.target.value)}
                    />
                );
        }
    };

    // Обработчик отправки заполненной формы
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        try {
            // Отправляем ответы на endpoint. Предположим, что endpoint:
            // POST /api/templates/{id}/submit ожидает объект { answers: { [questionId]: answer } }
            const payload = { answers };
            const response = await axiosInstance.post(`/templates/${id}/submit`, payload);
            setSubmitSuccess('Form submitted successfully!');
            // При необходимости можно выполнить редирект:
            // navigate(`/template/${id}/results`);
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
            setSubmitError('Error submitting the form. Please try again.');
        }
    };

    if (!template) return <div>Loading...</div>;

    return (
        <Container className="mt-4">
            <h1>{template.title}</h1>
            <p>{template.description}</p>
            <Tabs defaultActiveKey="general" id="template-tabs" className="mb-3">
                <Tab eventKey="general" title="General">
                    <Card className="mb-3">
                        <Card.Header>General Settings</Card.Header>
                        <Card.Body>
                            <p>
                                <strong>Title:</strong> {template.title}
                            </p>
                            <p>
                                <strong>Description:</strong> {template.description}
                            </p>
                            {/* Дополнительные настройки, если нужны */}
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="questions" title="Questions">
                    <Card className="mb-3">
                        <Card.Header>Questions</Card.Header>
                        <ListGroup variant="flush">
                            {template.questions.map((q) => (
                                <ListGroup.Item key={q.id}>
                                    {q.text} <em>({q.type})</em>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Tab>
                <Tab eventKey="results" title="Results">
                    <Card className="mb-3">
                        <Card.Header>Filled Forms</Card.Header>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Answers</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filledForms.map((form) => (
                                    <tr key={form.id}>
                                        <td>{form.user}</td>
                                        <td>{form.answers.join(', ')}</td>
                                        <td>
                                            <Link to={`/edit-page/${form.id}`}>
                                                <Button variant="outline-primary" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Tab>
                <Tab eventKey="aggregation" title="Aggregation">
                    <Card className="mb-3">
                        <Card.Header>Aggregation of Results</Card.Header>
                        <Card.Body>
                            <p>
                                Aggregation metrics (e.g., averages, most common answers) will be displayed here.
                            </p>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
            <h2>Fill Out This Form</h2>
            <Form onSubmit={handleFormSubmit}>
                {template.questions.map((q) => (
                    <Form.Group className="mb-3" key={q.id}>
                        <Form.Label>{q.text}</Form.Label>
                        {renderQuestionInput(q)}
                    </Form.Group>
                ))}
                {submitError && <Alert variant="danger">{submitError}</Alert>}
                {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default TemplatePage;
