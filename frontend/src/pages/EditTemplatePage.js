import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import TemplateForm from '../components/TemplateForm';
import { getTemplate, updateTemplate } from '../api/templateService';
import { notifyError } from '../utils/notification';
import { checkbox, dropdown } from '../utils/questionsTypes';
import { Education, Other, Quiz, topicOptions } from '../config/options';
import axiosInstance from '../api/axiosInstance';

const EditTemplatePage = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();

    const [isPhotoDeleted, setIsPhotoDeleted] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        topic: '',
        customTopic: '',
        tags: [],
        accessType: 'public',
        selectedUsers: [],
        photoUrl: null,
        photo: null
    });

    const {
        questions,
        setQuestions,
        addQuestion,
        removeQuestion,
        moveQuestion,
        handleQuestionChange,
        handleOptionChange,
        addOptionToQuestion,
        updateOptions
    } = useQuestions([]);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const data = await getTemplate(templateId);

                const updatedFormData = {
                    ...data,
                    photoUrl: data.photoUrl,
                    selectedUsers: data.allowedUsers,
                    tags: data.tags,
                    topic: data.topic,
                };

                if (data.topic !== Education && data.topic !== Quiz) {
                    updatedFormData.customTopic = data.topic;
                    updatedFormData.topic = Other;
                }

                setFormData(updatedFormData);
                setQuestions(data.questions);
                setIsPhotoDeleted(!data.photoUrl);
            } catch (error) {
                console.error('Loading failed:', error);
            }
        };
        loadTemplate();
    }, [setQuestions, templateId]);


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
                formData.tags.map(tag => parseInt(tag.value))
            ));
        }

        if (formData.accessType === 'private' && formData.selectedUsers.length > 0) {
            formPayload.append('allowedUserIds', JSON.stringify(
                formData.selectedUsers.map(user => user.value)
            ));
        }

        if (isPhotoDeleted) {
            formPayload.append('photo', '');
        } else if (formData.photo) {
            formPayload.append('photo', formData.photo);
        }

        formPayload.append('questions', JSON.stringify(cleanedQuestions));

        try {
            await updateTemplate(templateId, formPayload);
            navigate(`/template/${templateId}`);
        } catch (error) {
            console.error('Template update error:', error);
            notifyError(error.response?.data?.message || 'Failed to update template');
        }
    };

    const handleDeletePhoto = async () => {

        setFormData({ ...formData, photoUrl: null, photo: null });
        setIsPhotoDeleted(true);

        await axiosInstance.delete(`/templates/${parseInt(templateId)}/photo`);
    };

    return (
        <Container className="py-4">
            <Card>
                <Card.Body>
                    <h1 className="text-center mb-4">Edit Template</h1>
                    <TemplateForm
                        mode="edit"
                        formData={formData}
                        setFormData={setFormData}
                        questions={questions}
                        onQuestionAdd={addQuestion}
                        onQuestionRemove={removeQuestion}
                        onQuestionMove={moveQuestion}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        updateOptions={updateOptions}
                        onOptionAdd={addOptionToQuestion}
                        onSubmit={handleSubmit}
                        topicOptions={topicOptions}
                        onDeletePhoto={handleDeletePhoto}
                        onSetPhotoDelete={setIsPhotoDeleted}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditTemplatePage;