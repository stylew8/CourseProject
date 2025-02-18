import React from 'react';
import { Form } from 'react-bootstrap';

const QuestionInput = ({ question, value, onChange, onCheckboxChange }) => {
    switch (question.type) {
        case 'single-line':
            return (
                <Form.Control
                    type="text"
                    placeholder="Your answer"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
        case 'multi-line':
            return (
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Your answer"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
        case 'dropdown':
            return (
                <Form.Select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="" disabled>
                        Select an option
                    </option>
                    {question.options &&
                        question.options.map((opt) => (
                            <option key={opt.id} value={opt.value}>
                                {opt.value}
                            </option>
                        ))}
                </Form.Select>
            );
        case 'checkbox':
            return (
                <div>
                    {question.options &&
                        question.options.map((opt) => (
                            <Form.Check
                                key={opt.id}
                                type="checkbox"
                                label={opt.value}
                                checked={Array.isArray(value) && value.includes(opt.value)}
                                onChange={(e) =>
                                    onCheckboxChange(opt.value, e.target.checked)
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
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                />
            );
    }
};

export default QuestionInput;
