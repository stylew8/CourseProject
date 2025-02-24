import React, { useState, useEffect, useContext } from 'react';
import { Container, Tabs, Tab, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

import GeneralSettings from '../components/GeneralSettings';
import QuestionsList from '../components/QuestionsList';
import FilledFormsTable from '../components/FilledFormsTable';
import AggregationResults from '../components/AggregationResults';
import FillForm from '../components/FillForm';
import { Admin } from '../api/roles';
import { notifyError, notifySuccess } from '../utils/notification';
import Comments from '../components/Comments/CommentsTab'; 

const TemplatePage = () => {
    const { id } = useParams();
    const { user, roles, isAuthenticated } = useContext(AuthContext);
    const [template, setTemplate] = useState(null);
    const [filledForms, setFilledForms] = useState([]);
    const [aggregationResults, setAggregationResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [canViewResults, setCanViewResults] = useState(false);
    const [answers, setAnswers] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseTemplate = await axiosInstance.get(`/templates/public/${id}`);

                if (responseTemplate.data.accessType === 'private') {
                    const allowedUserIds = responseTemplate.data.allowedUsers.map(userItem => userItem.id || userItem);
                    if (!allowedUserIds.includes(user.id) && !roles.includes(Admin) && responseTemplate.data.creatorId !== user.id) {
                        navigate('/');
                        return;
                    }
                }

                setTemplate(responseTemplate.data);
                const responseFilledForms = await axiosInstance.get(`/templates/${id}/filledForms`);
                setFilledForms(responseFilledForms.data);

                const responseResults = await axiosInstance.get(`/templates/${id}/results`);
                setAggregationResults(responseResults.data);

                setCanViewResults(user && (roles.includes(Admin) || user.id === responseTemplate.data.creatorId));

                const initialAnswers = {};
                responseTemplate.data.questions.forEach(q => {
                    initialAnswers[q.id] = q.type === 'checkbox' ? [] : '';
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, roles, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!template) return <div>Template not found.</div>;

    const handleAnswerChange = (question, value) => {
        setAnswers(prev => ({ ...prev, [question.id]: value }));
    };

    const handleCheckboxChange = (question, optionValue, checked) => {
        setAnswers(prev => {
            const prevArr = Array.isArray(prev[question.id]) ? prev[question.id] : [];
            return checked
                ? { ...prev, [question.id]: [...prevArr, optionValue] }
                : { ...prev, [question.id]: prevArr.filter(val => val !== optionValue) };
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        try {
            const payload = { answers };
            await axiosInstance.post(`/templates?templateId=${id}`, payload);
            notifySuccess('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message);
            notifyError('Error submitting the form. Please try again.');
        }
    };

    return (
        <Container className="mt-4">
            <h1>{template.title}</h1>
            <Tabs defaultActiveKey="general" id="template-tabs" className="mb-3">
                <Tab eventKey="general" title="General">
                    <GeneralSettings template={template} />
                </Tab>
                <Tab eventKey="questions" title="Questions">
                    <QuestionsList questions={template.questions} />
                </Tab>
                {canViewResults && (
                    <Tab eventKey="results" title="Results">
                        <Card className="mb-3">
                            <Card.Header>Results</Card.Header>
                            <Card.Body>
                                <h3>Filled Forms</h3>
                                <FilledFormsTable filledForms={filledForms} />
                                <h3>Aggregation Results</h3>
                                <AggregationResults aggregationResults={aggregationResults} />
                            </Card.Body>
                        </Card>
                    </Tab>
                )}
                <Tab eventKey="comments" title="Comments">
                    <Comments templateId={id} />
                </Tab>
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
