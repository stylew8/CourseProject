import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import TemplateCard from '../components/TemplateCard';
import FormList from '../components/FormList';
import axiosInstance from '../api/axiosInstance';

const UserDashboard = () => {
    const [templates, setTemplates] = useState([]);
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const templatesResponse = await axiosInstance.get('/dashboard/templates');
                const formsResponse = await axiosInstance.get('/dashboard/filledforms');
                setTemplates(templatesResponse.data);
                setForms(formsResponse.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err.response?.data || err.message);
                setError(err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container>
            <h1>User Dashboard</h1>
            <Tabs defaultActiveKey="templates" className="mb-3">
                {[
                    <Tab eventKey="templates" title="My Templates" key="templates">
                        {templates.length === 0 ? (
                            <p>No templates found.</p>
                        ) : (
                            templates.map((template, index) => (
                                <TemplateCard key={`${template.id}-${index}`} template={template} />
                            ))
                        )}
                    </Tab>,
                    <Tab eventKey="forms" title="My Filled Forms" key="forms">
                        {forms.length === 0 ? (
                            <p>No filled forms found.</p>
                        ) : (
                            <FormList forms={forms} />
                        )}
                    </Tab>
                ]}
            </Tabs>
        </Container>
    );
};

export default UserDashboard;
