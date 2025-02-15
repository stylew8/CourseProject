// src/pages/CreateTemplatePage.js
import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableQuestion from '../components/DraggableQuestion';
import { createTemplate } from '../api/templateService';
import { useNavigate } from 'react-router-dom';

const CreateTemplatePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            order: questions.length,
            type: 'single-line',
            text: '',
            description: '',
            showInTable: false,
            options: []
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleQuestionChange = (index, key, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][key] = value;
        setQuestions(updatedQuestions);
    };

    const addOptionToQuestion = (index) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[index].options.length < 4) {
            const newOption = {
                id: Date.now(),
                order: updatedQuestions[index].options.length,
                value: ''
            };
            updatedQuestions[index].options.push(newOption);
            setQuestions(updatedQuestions);
        } else {
            alert('Maximum of 4 options allowed');
        }
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        if (questions[questionIndex] && questions[questionIndex].options[optionIndex]) {
            const updatedQuestions = [...questions];
            updatedQuestions[questionIndex].options[optionIndex].value = value;
            setQuestions(updatedQuestions);
        }
    };

    const updateOptions = (questionIndex, newOptions) => {
        const updatedQuestions = [...questions];
        newOptions.forEach((option, i) => {
            option.order = i;
        });
        updatedQuestions[questionIndex].options = newOptions;
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        updatedQuestions.forEach((q, i) => {
            q.order = i;
        });
        setQuestions(updatedQuestions);
    };

    const moveQuestion = (dragIndex, hoverIndex) => {
        const updatedQuestions = Array.from(questions);
        const [movedQuestion] = updatedQuestions.splice(dragIndex, 1);
        updatedQuestions.splice(hoverIndex, 0, movedQuestion);
        updatedQuestions.forEach((q, i) => {
            q.order = i;
        });
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { title, description, questions };
        try {
            const result = await createTemplate(data);
            console.log('Template created:', result);
            navigate(`/edit-template/${result.id}`);
        } catch (error) {
            console.error('Error creating template:', error.response?.data || error.message);
        }
    };

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <h1 className="mb-4 text-center">Create New Form</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Form Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter form title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter form description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <h3 className="mb-3">Questions</h3>
                    <DndProvider backend={HTML5Backend}>
                        {questions.map((question, index) => (
                            <DraggableQuestion
                                key={question.id}
                                index={index}
                                question={question}
                                handleQuestionChange={handleQuestionChange}
                                handleOptionChange={handleOptionChange}
                                updateOptions={updateOptions}
                                addOptionToQuestion={addOptionToQuestion}
                                removeQuestion={removeQuestion}
                                moveQuestion={moveQuestion}
                            />
                        ))}
                    </DndProvider>

                    <div className="d-flex justify-content-between gap-3 text-center">
                        <Button variant="outline-primary" onClick={addQuestion} className="mb-3">
                            Add Question
                        </Button>
                        <Button type="submit" variant="primary">
                            Submit Form
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateTemplatePage;
