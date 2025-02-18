import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const QuestionsList = ({ questions }) => (
    <Card className="mb-3">
        <Card.Header>Questions</Card.Header>
        <ListGroup variant="flush">
            {questions.map((q) =>
                q.showInTable ? (
                    <ListGroup.Item key={q.id}>
                        {q.text} <em>({q.type})</em>
                    </ListGroup.Item>
                ) : null
            )}
        </ListGroup>
    </Card>
);

export default QuestionsList;
