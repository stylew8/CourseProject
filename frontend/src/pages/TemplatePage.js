import React, { useState, useEffect, useContext } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext'; // путь может отличаться

import GeneralSettings from '../components/GeneralSettings';
import QuestionsList from '../components/QuestionsList';
import FilledFormsTable from '../components/FilledFormsTable';
import AggregationResults from '../components/AggregationResults';
import FillForm from '../components/FillForm';

const TemplatePage = () => {
    const { id } = useParams();
    const { user, roles, isAuthenticated } = useContext(AuthContext); // получаем статус авторизации
    const [template, setTemplate] = useState(null);
    const [filledForms, setFilledForms] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axiosInstance.get(`/templates/public/${id}`);
                setTemplate(response.data);
            } catch (error) {
                console.error('Error fetching template:', error.response?.data || error.message);
            }
        };

        const fetchFilledForms = async () => {
            try {
                const response = await axiosInstance.get(`/templates/${id}/filledForms`);
                setFilledForms(response.data);
            } catch (error) {
                console.error('Error fetching filled forms:', error.response?.data || error.message);
            }
        };

        fetchTemplate();
        fetchFilledForms();
    }, [id]);

    if (!template) return <div>Loading...</div>;

    // Вкладки "Results" и "Aggregation" доступны только для админа или создателя шаблона
    const canViewResults = user && (roles.includes('admin') || user.id === template.creatorId);

    const handleAnswerChange = (question, value) => {
        setAnswers(prev => ({ ...prev, [question.id]: value }));
    };

    const handleCheckboxChange = (question, optionValue, checked) => {
        setAnswers(prev => {
            const prevArr = Array.isArray(prev[question.id]) ? prev[question.id] : [];
            if (checked) {
                return { ...prev, [question.id]: [...prevArr, optionValue] };
            } else {
                return { ...prev, [question.id]: prevArr.filter(val => val !== optionValue) };
            }
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        try {
            const payload = { answers };
            console.log("Payload to submit:", payload);
            const response = await axiosInstance.post(`/templates?templateId=${id}`, payload);
            setSubmitSuccess('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
            setSubmitError('Error submitting the form. Please try again.');
        }
    };
    

    return (
        <Container className="mt-4">
            <h1>{template.title}</h1>
            <p>{template.description}</p>
            <Tabs defaultActiveKey="general" id="template-tabs" className="mb-3">
                <Tab eventKey="general" title="General">
                    <GeneralSettings template={template} />
                </Tab>
                <Tab eventKey="questions" title="Questions">
                    <QuestionsList questions={template.questions} />
                </Tab>
                {canViewResults && (
                    <Tab eventKey="results" title="Results">
                        <FilledFormsTable filledForms={filledForms} />
                    </Tab>
                )}
                {canViewResults && (
                    <Tab eventKey="aggregation" title="Aggregation">
                        <AggregationResults />
                    </Tab>
                )}
            </Tabs>

            <h2>Fill Out This Form</h2>
            <FillForm
                questions={template.questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onCheckboxChange={handleCheckboxChange}
                onSubmit={handleFormSubmit}
                submitError={submitError}
                submitSuccess={submitSuccess}
                readOnly={!isAuthenticated}
            />
        </Container>
    );
};

export default TemplatePage;
