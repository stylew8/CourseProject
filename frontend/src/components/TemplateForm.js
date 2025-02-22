import React, { useCallback, useState } from 'react';
import { Form, Button, Row, Col, Image, ButtonGroup } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import axiosInstance from '../api/axiosInstance';
import { notifyError } from '../utils/notification';
import DraggableQuestion from './DraggableQuestion';
import MarkdownEditor from './MarkdownEditor';

const TemplateForm = ({
    mode = 'create',
    formData,
    setFormData,
    questions,
    onQuestionAdd,
    onQuestionRemove,
    onQuestionMove,
    onQuestionChange,
    onOptionChange,
    onOptionAdd,
    onSubmit,
    topicOptions,
}) => {
    const {
        title,
        description,
        topic,
        customTopic,
        tags,
        accessType,
        selectedUsers,
        photoUrl
    } = formData;

    const [userSort, setUserSort] = useState('name');

    const sortedUsers = [...selectedUsers].sort((a, b) =>
        userSort === 'name'
            ? a.name.localeCompare(b.userName)
            : a.email.localeCompare(b.email)
    );

    const loadTagSuggestions = useCallback(
        debounce(async (inputValue) => {
            try {
                const response = await axiosInstance.get(`/search/tags?query=${inputValue}`);
                return response.data.map(tag => ({
                    value: tag.id,
                    label: tag.name,
                }));
            } catch (error) {
                notifyError('Failed to load tags');
                return [];
            }
        }, 300),
        []
    );

    const loadUserSuggestions = useCallback(
        debounce(async (inputValue) => {
            try {
                const response = await axiosInstance.get(`/search/users?query=${inputValue}`);
                return response.data.map(user => ({
                    value: user.id,
                    label: `${user.email}`,
                    name: user.userName,
                    email: user.email
                }));
            } catch (error) {
                notifyError('Failed to load users');
                return [];
            }
        }, 300),
        []
    );

    const handleUserChange = async (selected) => {
        try {
            const response = await axiosInstance.post('/search/users/validate', {
                ids: selected.map(u => u.value)
            });

            if (response.data.invalidIds?.length > 0) {
                notifyError('Some users are invalid');
                return;
            }

            setFormData({
                ...formData,
                selectedUsers: selected
            });
        } catch (error) {
            notifyError('User validation failed');
        }
    };

    const handleDeletePhoto = () => {
        setFormData({ ...formData, photoUrl: null, photo: null });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Form Title *</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <MarkdownEditor
                        value={description}
                        onChange={(newValue) => setFormData({ ...formData, description: newValue })}
                    />

                    <Form.Group className="mb-3">
                        <Form.Label>Access Type</Form.Label>
                        <div>
                            <Form.Check
                                inline
                                type="radio"
                                label="Public"
                                checked={accessType === 'public'}
                                onChange={() => setFormData({ ...formData, accessType: 'public' })}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="Private"
                                checked={accessType === 'private'}
                                onChange={() => setFormData({ ...formData, accessType: 'private' })}
                            />
                        </div>
                    </Form.Group>

                    {accessType === 'private' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Users</Form.Label>
                                <Select
                                    isMulti
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadUserSuggestions}
                                    value={sortedUsers}
                                    onChange={handleUserChange}
                                    placeholder="Search by name or email..."
                                />
                            </Form.Group>
                        </>
                    )}
                </Col>

                <Col md={6} >
                    <Form.Group className="mb-3">
                        <Form.Label>Topic *</Form.Label>
                        <Form.Select
                            value={topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            required
                        >
                            <option value="">Select topic</option>
                            {topicOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {topic === 'Other' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Custom Topic *</Form.Label>
                            <Form.Control
                                value={customTopic}
                                onChange={(e) => setFormData({ ...formData, customTopic: e.target.value })}
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label>
                        <Select
                            isMulti
                            cacheOptions
                            defaultOptions
                            loadOptions={loadTagSuggestions}
                            value={tags}
                            onChange={(selected) => setFormData({ ...formData, tags: selected })}
                            placeholder="Search tags..."
                        />
                    </Form.Group>

                    {photoUrl && (
                        <div className="mb-3 position-relative">
                            <Image src={photoUrl} fluid style={{ maxWidth: 200 }} />
                            <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={handleDeletePhoto}
                            >
                                ×
                            </Button>
                        </div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>{mode === 'create' ? 'Upload Photo' : 'Update Photo'}</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <h3>Questions *</h3>
            <DndProvider backend={HTML5Backend}>
                {questions.map((question, index) => (
                    <DraggableQuestion
                        key={question.id}
                        index={index}
                        question={question}
                        onMove={onQuestionMove}
                        onChange={onQuestionChange}
                        onOptionChange={onOptionChange}
                        onAddOption={onOptionAdd}
                        onRemove={onQuestionRemove}
                    />
                ))}
            </DndProvider>

            <div className="mt-4">
                <Button variant="outline-primary" onClick={onQuestionAdd}>
                    Add Question
                </Button>
                <Button type="submit" variant="primary" className="ms-2">
                    {mode === 'create' ? 'Create Template' : 'Save Changes'}
                </Button>
            </div>
        </Form>
    );
};

export default TemplateForm;
