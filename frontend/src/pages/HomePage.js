import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TemplateCard from '../components/TemplateCard';
import TagCloud from '../components/TagCloud';

const HomePage = () => {
    const templates = [
        { id: 1, title: 'Job Application', description: 'Apply for your dream job using this form.' },
        { id: 2, title: 'Customer Feedback', description: 'Collect feedback from your customers.' }
    ];

    const tags = ['Education', 'Feedback', 'Survey', 'Job Application'];

    return (
        <div>
            <h1>Welcome to Custom Forms</h1>
            <Row className="mt-4">
                <Col md={8}>
                    <h2>Latest Templates</h2>
                    {templates.map(template => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </Col>
                <Col md={4}>
                    <h2>Tag Cloud</h2>
                    <TagCloud tags={tags} />
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;