import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import TemplateForm from '../components/TemplateForm';
import { createTemplate } from '../api/templateService';
import { topicOptions, tagOptions, userOptions } from '../config/options';
import { notifyError }from '../utils/notification';
import { checkbox, dropdown } from '../utils/questionsTypes';

const CreateTemplatePage = () => {
    const navigate = useNavigate();
    const {
        questions,
        addQuestion,
        removeQuestion,
        moveQuestion,
        handleQuestionChange,
        handleOptionChange,
        addOptionToQuestion,
        updateOptions
    } = useQuestions([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        topic: '',
        customTopic: '',
        tags: [],
        accessType: 'public',
        selectedUsers: [],
        photo: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const cleanedQuestions = questions.map(({ 
            order, 
            type, 
            text, 
            description, 
            showInTable, 
            options 
        }) => ({
            order,
            type,
            text,
            description,
            showInTable,
            options: options?.map(({ order, value }) => ({ order, value })) || []
        }));
    
        if (cleanedQuestions.length === 0) {
            notifyError("Please add at least one question.");
            return;
        }
    
        const optionQuestions = cleanedQuestions.filter(q => 
            q.type === checkbox || q.type === dropdown
        );
        
        if (optionQuestions.some(q => q.options.length < 2)) {
            notifyError("Questions with options must have at least 2 choices");
            return;
        }
    
        if (!formData.topic) {
            notifyError("Please select a topic");
            return;
        }
    
        let finalTopic = formData.topic;
        if (formData.topic === 'Other') {
            if (!formData.customTopic.trim()) {
                notifyError("Please enter custom topic name");
                return;
            }
            finalTopic = formData.customTopic;
        }
    
        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('description', formData.description);
        formPayload.append('topic', finalTopic);
        formPayload.append('accessType', formData.accessType);
        
        if (formData.tags.length > 0) {
            formPayload.append('tagIds', JSON.stringify(
                formData.tags.map(tag => tag.value)
            ));
        }
    
        if (formData.accessType === 'private' && formData.selectedUsers.length > 0) {
            formPayload.append('allowedUserIds', JSON.stringify(
                formData.selectedUsers.map(user => user.value)
            ));
        }
    
        if (formData.photo) {
            formPayload.append('photo', formData.photo);
        }
    
        formPayload.append('questions', JSON.stringify(cleanedQuestions));
    
        try {
            const result = await createTemplate(formPayload);
            navigate(`/edit-template/${result.id}`);
        } catch (error) {
            console.error('Template creation error:', error);
            notifyError(error.response?.data?.message || 'Failed to create template');
        }
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <h1 className="text-center mb-4">Create New Template</h1>
                    <TemplateForm
                        mode="create"
                        formData={formData}
                        setFormData={setFormData}
                        questions={questions}
                        onQuestionAdd={addQuestion}
                        onQuestionRemove={removeQuestion}
                        onQuestionMove={moveQuestion}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        onOptionAdd={addOptionToQuestion}
                        updateOptions={updateOptions}
                        onSubmit={handleSubmit}
                        topicOptions={topicOptions}
                        tagOptions={tagOptions}
                        userOptions={userOptions}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateTemplatePage;