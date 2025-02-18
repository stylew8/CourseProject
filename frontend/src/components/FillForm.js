import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import QuestionInput from './QuestionInput';

const FillForm = ({
    questions,
    answers,
    onAnswerChange,
    onCheckboxChange,
    onSubmit,
    submitError,
    submitSuccess,
    readOnly,
}) => (
    <Form onSubmit={onSubmit}>
        <fieldset disabled={readOnly}>
            {questions.map((q) => (
                <Form.Group className="mb-3" key={q.id}>
                    <Form.Label>{q.text}</Form.Label>
                    <QuestionInput
                        question={q}
                        value={answers[q.id]}
                        onChange={(value) => onAnswerChange(q, value)}
                        onCheckboxChange={(optionValue, checked) => onCheckboxChange(q, optionValue, checked)}
                    />
                </Form.Group>
            ))}
        </fieldset>
        {readOnly ? (
            <p className="text-muted">
                You are not authorized
            </p>
        ) : (
            <>
                {submitError && <Alert variant="danger">{submitError}</Alert>}
                {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </>
        )}
    </Form>
);

export default FillForm;
