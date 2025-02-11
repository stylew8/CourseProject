import React from 'react';
import { Card, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { GripHorizontal, GripVertical } from 'react-bootstrap-icons';
import OptionItem from './OptionItem';

const QuestionCard = ({ question, index, handleQuestionChange, handleOptionChange, updateOptions, addOptionToQuestion, removeQuestion }) => {
    const questionTypes = ["single-line", "multi-line", "dropdown", "checkbox"];

    // Функция для переупорядочивания опций
    const reorderOption = (dragIndex, hoverIndex) => {
        const updatedOptions = Array.from(question.options);
        const [movedOption] = updatedOptions.splice(dragIndex, 1);
        updatedOptions.splice(hoverIndex, 0, movedOption);
        updateOptions(index, updatedOptions);
    };

    const removeOption = (optionIndex) => {
        if (question.options[optionIndex]) {
            const updatedOptions = [...question.options];
            updatedOptions.splice(optionIndex, 1);
            updateOptions(index, updatedOptions);
        }
    };

    return (
        <Card className="mb-3">
            <Col className="text-center" style={{ cursor: 'grab' }}>
                <GripHorizontal style={{ fontSize: '30px' }} />
            </Col>
            <Card.Body>
                <Button size="sm" className='mb-3' variant="outline-danger" onClick={() => removeQuestion(index)}>
                    Remove Question
                </Button>

                <Row className="align-items-center mb-3">
                    <Col md={7}>
                        <Form.Control
                            type="text"
                            placeholder="Enter your question title"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                        >
                            {questionTypes.map((type, i) => (
                                <option key={i} value={type}>
                                    {type === 'single-line' && 'Text (single-line)'}
                                    {type === 'multi-line' && 'Text (multi-line)'}
                                    {type === 'dropdown' && 'Dropdown'}
                                    {type === 'checkbox' && 'Checkbox'}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter question description (optional)"
                            value={question.description}
                            onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Check
                            type="checkbox"
                            label="Show in table of filled-out forms"
                            checked={question.showInTable}
                            onChange={(e) => handleQuestionChange(index, 'showInTable', e.target.checked)}
                        />
                    </Col>
                </Row>

                {(question.type === 'dropdown' || question.type === 'checkbox') && (
                    <div>
                        <h6>Options</h6>
                        {question.options.map((option, optionIndex) => (
                            <OptionItem key={option.id} index={optionIndex} moveOption={reorderOption}>
                                <InputGroup className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder={`Option ${optionIndex + 1}`}
                                        value={option.value}
                                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => removeOption(optionIndex)}
                                    >
                                        Remove
                                    </Button>
                                </InputGroup>
                            </OptionItem>
                        ))}
                        {question.options.length < 4 && (
                            <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => addOptionToQuestion(index)}
                            >
                                Add Option
                            </Button>
                        )}
                    </div>
                )}

            </Card.Body>
        </Card>
    );
};

export default QuestionCard;
