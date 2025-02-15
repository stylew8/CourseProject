import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import DraggableQuestion from '../components/DraggableQuestion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplate, updateTemplate } from '../api/templateService';

const EditTemplatePage = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const data = await getTemplate(templateId);
                setTemplate(data);
                const sortedQuestions = data.questions.sort((a, b) => a.order - b.order);
                setQuestions(sortedQuestions);
            } catch (error) {
                console.error('Error fetching template:', error.response?.data || error.message);
            }
        };
        fetchTemplate();
    }, [templateId]);

    const handleTemplateChange = (key, value) => {
        setTemplate({ ...template, [key]: value });
    };

    const handleQuestionChange = (index, key, value) => {
        const updated = [...questions];
        updated[index][key] = value;
        setQuestions(updated);
    };

    const handleOptionsChange = (questionIndex, newOptions) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options = newOptions;
        setQuestions(updatedQuestions);
    };

    const addOptionToQuestion = (questionIndex) => {
        const updatedQuestions = [...questions];
        const newOption = {
            id: Date.now(),
            order: updatedQuestions[questionIndex].options.length,
            value: ""
        };
        updatedQuestions[questionIndex].options.push(newOption);
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex].value = value;
        setQuestions(updatedQuestions);
    };

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

    const removeQuestion = (index) => {
        const updated = questions.filter((_, i) => i !== index);
        updated.forEach((q, i) => { q.order = i; });
        setQuestions(updated);
    };

    const moveQuestion = (dragIndex, hoverIndex) => {
        const updated = [...questions];
        const [movedQuestion] = updated.splice(dragIndex, 1);
        updated.splice(hoverIndex, 0, movedQuestion);
        updated.forEach((q, i) => { q.order = i; });
        setQuestions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedTemplate = { ...template, questions };
        try {
            const result = await updateTemplate(template.id, updatedTemplate);
            console.log('Template updated:', result);
            navigate(`/template/${template.id}`);
        } catch (error) {
            console.error('Error updating template:', error.response?.data || error.message);
        }
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
                                updateOptions={handleOptionsChange}
                                addOptionToQuestion={addOptionToQuestion}
                                handleOptionChange={handleOptionChange}
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