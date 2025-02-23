import React, { useState } from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
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
    updateOptions,
    onSubmit,
    topicOptions,
    onDeletePhoto,
    onSetPhotoDelete
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

    const [inputValue, setInputValue] = useState('');

    const debouncedLoadTagSuggestions = debounce(async (inputValue) => {
        if (!inputValue || inputValue.trim() === '') {
            return [];
        }
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
    }, 300);

    const loadTagSuggestions = (inputValue) => {
        return debouncedLoadTagSuggestions(inputValue);
    };

    const handleFileChange = (e) => {
        onSetPhotoDelete(false);
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold"><span className="text-danger">*</span> Form Title</Form.Label>
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
                        <Form.Label className="fw-bold"><span className="text-danger">*</span> Access Type</Form.Label>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Select Users</Form.Label>
                            <AsyncCreatableSelect
                                isMulti
                                cacheOptions
                                defaultOptions
                                menuIsOpen={false}
                                inputValue={inputValue}
                                onInputChange={(value) => setInputValue(value)}
                                onKeyDown={async (event) => {
                                    if (event.key === 'Enter' && inputValue.trim()) {
                                        event.preventDefault();
                                        try {
                                            const response = await axiosInstance.post('/search/user/validate', {
                                                email: inputValue.trim()
                                            });

                                            if (response.data && response.data.user) {
                                                const user = response.data.user;
                                                const newUser = {
                                                    value: user.id,
                                                    label: user.email,
                                                    email: user.email,
                                                    name: user.userName,
                                                };

                                                setFormData({
                                                    ...formData,
                                                    selectedUsers: [...selectedUsers, newUser]
                                                });
                                                setInputValue('');
                                            } else {
                                                notifyError('User with that email was not found');
                                            }
                                        } catch (error) {
                                            notifyError('User with that email was not found');
                                        }
                                    }
                                }}
                                value={selectedUsers} 
                                onChange={(newValue) =>
                                    setFormData({ ...formData, selectedUsers: newValue })
                                }
                                placeholder="Enter email and press Enter..."
                            />
                        </Form.Group>
                    )}
                </Col>

                <Col md={6} >
                    <Form.Group className="mb-3">
                        <Form.Label className='fw-bold'><span className="text-danger">*</span> Topic</Form.Label>
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
                        <AsyncSelect
                            isMulti
                            cacheOptions
                            defaultOptions
                            loadOptions={loadTagSuggestions}
                            value={tags}
                            onChange={(selected) => setFormData({ ...formData, tags: selected })}
                            placeholder="Search tags..."
                        />
                    </Form.Group>

                    {photoUrl ? (
                        <div className="mb-3 position-relative">
                            <Image src={photoUrl} fluid style={{ maxWidth: 400 }} />
                            <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0"
                                onClick={onDeletePhoto}
                            >
                                ×
                            </Button>
                        </div>
                    ) : (
                        <Form.Group className="mb-3">
                            <Form.Label>{mode === 'create' ? 'Upload Photo' : 'Update Photo'}</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>)}
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
                        updateOptions={updateOptions}
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
