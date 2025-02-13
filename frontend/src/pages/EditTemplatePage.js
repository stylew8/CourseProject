import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import DraggableQuestion from '../components/DraggableQuestion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const EditTemplatePage = ({ templateId }) => {
    const [template, setTemplate] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // Имитация загрузки шаблона (в реальном случае делайте запрос к API)
        const fetchedTemplate = {
            id: templateId,
            title: 'Job Application',
            description: 'Apply for your dream job using this form.',
            questions: [
                { id: 1, type: 'single-line', text: 'What position are you applying for?', description: '', showInTable: true, options: [] },
                { id: 2, type: 'integer', text: 'Years of experience', description: '', showInTable: true, options: [{ id: 1, value: '1-3' }, { id: 2, value: '4-6' }, { id: 3, value: '7+' }] }
            ]
        };
        setTemplate(fetchedTemplate);
        setQuestions(fetchedTemplate.questions);
    }, [templateId]);

    const handleTemplateChange = (key, value) => {
        setTemplate({ ...template, [key]: value });
    };

    const handleQuestionChange = (index, key, value) => {
        const updated = [...questions];
        updated[index][key] = value;
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now(), type: 'single-line', text: '', description: '', showInTable: false, options: [] }]);
    };

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        setQuestions(updated);
    };

    const moveQuestion = (dragIndex, hoverIndex) => {
        const dragged = questions[dragIndex];
        const updated = [...questions];
        updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, dragged);
        setQuestions(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь отправьте изменённый шаблон и вопросы на сервер
        console.log('Updated Template:', { ...template, questions });
    };

    if (!template) return <div>Loading...</div>;

    return (
        <Container>
            <Card className="p-4 shadow-sm">
                <h1 className="mb-4 text-center">Edit Template</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Template Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={template.title}
                            onChange={(e) => handleTemplateChange('title', e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={template.description}
                            onChange={(e) => handleTemplateChange('description', e.target.value)}
                        />
                    </Form.Group>
                    <h3 className="mb-3">Questions</h3>
                    <DndProvider backend={HTML5Backend}>
                        {questions.map((q, index) => (
                            <DraggableQuestion
                                key={q.id}
                                index={index}
                                question={q}
                                moveQuestion={moveQuestion}
                                handleQuestionChange={handleQuestionChange}
                                removeQuestion={removeQuestion}
                            />
                        ))}
                    </DndProvider>
                    <Button variant="outline-primary" onClick={addQuestion} className="mb-3">
                        Add Question
                    </Button>
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default EditTemplatePage;
