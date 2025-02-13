import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Tabs, Tab, Card, ListGroup, Table, Form, Button } from 'react-bootstrap';

const TemplatePage = () => {
    const template = {
        id: 1,
        title: 'Job Application',
        description: 'Apply for your dream job using this form.',
        questions: [
            { id: 1, text: 'What position are you applying for?', type: 'single-line' },
            { id: 2, text: 'Tell us about your experience', type: 'multi-line' },
            {
                id: 3, text: 'Select your department', type: 'dropdown', options: [
                    { id: 1, value: 'Engineering' },
                    { id: 2, value: 'Design' },
                    { id: 3, value: 'Marketing' }
                ]
            },
            {
                id: 4, text: 'Select applicable skills', type: 'checkbox', options: [
                    { id: 1, value: 'JavaScript' },
                    { id: 2, value: 'React' },
                    { id: 3, value: 'Node.js' }
                ]
            }
        ]
    };

    const filledForms = [
        { id: 1, user: 'John Doe', answers: ['Developer', '5 years', 'Engineering', 'JavaScript, React'] },
        { id: 2, user: 'Jane Smith', answers: ['Designer', '3 years', 'Design', 'React'] }
    ];

    const renderQuestionInput = (q) => {
        switch (q.type) {
            case 'single-line':
                return <Form.Control type="text" placeholder="Your answer" />;
            case 'multi-line':
                return <Form.Control as="textarea" rows={3} placeholder="Your answer" />;
            case 'dropdown':
                return (
                    <Form.Select defaultValue="">
                        <option value="" disabled>Select an option</option>
                        {q.options && q.options.map(opt => (
                            <option key={opt.id} value={opt.value}>{opt.value}</option>
                        ))}
                    </Form.Select>
                );
            case 'checkbox':
                return (
                    <div>
                        {q.options && q.options.map(opt => (
                            <Form.Check key={opt.id} type="checkbox" label={opt.value} />
                        ))}
                    </div>
                );
            default:
                return <Form.Control type="text" placeholder="Your answer" />;
        }
    };

    return (
        <Container className="mt-4">
            <h1>{template.title}</h1>
            <p>{template.description}</p>
            <Tabs defaultActiveKey="general" id="template-tabs" className="mb-3">
                <Tab eventKey="general" title="General">
                    <Card className="mb-3">
                        <Card.Header>General Settings</Card.Header>
                        <Card.Body>
                            <p><strong>Title:</strong> {template.title}</p>
                            <p><strong>Description:</strong> {template.description}</p>
                            {/* Дополнительные настройки: тема, изображение, теги и т.д. */}
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="questions" title="Questions">
                    <Card className="mb-3">
                        <Card.Header>Questions</Card.Header>
                        <ListGroup variant="flush">
                            {template.questions.map(q => (
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
                                {filledForms.map(form => (
                                    <tr key={form.id}>
                                        <td>{form.user}</td>
                                        <td>{form.answers.join(', ')}</td>
                                        <td>
                                            {/* Кнопка перенаправляет на EditFormPage с передачей id заполненной формы */}
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
                            <p>Aggregation metrics (e.g., averages, most common answers) will be displayed here.</p>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
            <h2>Fill Out This Form</h2>
            <Form>
                {template.questions.map(q => (
                    <Form.Group className="mb-3" key={q.id}>
                        <Form.Label>{q.text}</Form.Label>
                        {renderQuestionInput(q)}
                    </Form.Group>
                ))}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default TemplatePage;
