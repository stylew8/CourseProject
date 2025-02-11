import React from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';

const TemplatePage = () => {
    const template = {
        id: 1,
        title: 'Job Application',
        description: 'Apply for your dream job using this form.',
        questions: [
            { id: 1, text: 'What position are you applying for?', type: 'single-line' },
            { id: 2, text: 'Years of experience', type: 'integer' },
            { id: 3, text: 'Phone number or Skype', type: 'single-line' }
        ]
    };

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h1>{template.title}</h1>
                    <p>{template.description}</p>
                    <Card className="mb-3">
                        <Card.Header>Questions</Card.Header>
                        <ListGroup variant="flush">
                            {template.questions.map(q => (
                                <ListGroup.Item key={q.id}>{q.text}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={4}>
                    <h2>Fill Form</h2>
                    <Form>
                        {template.questions.map(q => (
                            <Form.Group className="mb-3" key={q.id}>
                                <Form.Label>{q.text}</Form.Label>
                                <Form.Control type="text" placeholder="Your answer" />
                            </Form.Group>
                        ))}
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default TemplatePage;
