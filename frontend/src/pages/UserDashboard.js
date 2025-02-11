import React from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import TemplateCard from '../components/TemplateCard';
import FormList from '../components/FormList';

const UserDashboard = () => {
    const templates = [
        { id: 1, title: 'Job Application', description: 'Apply for your dream job using this form.' },
        { id: 2, title: 'Customer Feedback', description: 'Collect feedback from your customers.' }
    ];

    const forms = [
        { id: 1, user: 'John Doe', date: '2025-02-01' },
        { id: 2, user: 'Jane Smith', date: '2025-02-05' }
    ];

    return (
        <Container>
            <h1>User Dashboard</h1>
            <Tabs defaultActiveKey="templates" className="mb-3">
                <Tab eventKey="templates" title="My Templates">
                    {templates.map(template => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </Tab>
                <Tab eventKey="forms" title="My Filled Forms">
                    <FormList forms={forms} />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default UserDashboard;