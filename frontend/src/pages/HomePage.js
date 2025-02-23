import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import TemplateCard from '../components/TemplateCard';
import TagCloud from '../components/TagCloud';
import axiosInstance from '../api/axiosInstance';

const HomePage = () => {
    const [templates, setTemplates] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTemplates = () => {
            axiosInstance.get('/templates/latest')
                .then(response => {
                    setTemplates(response.data);
                })
                .catch(error => {
                    console.error('Error fetching templates:', error);
                })
                .finally(f => {
                    setLoading(false);
                }
                );
        };

        const fetchTags = () => {
            axiosInstance.get('/templates/tags')
            .then(response => {
                setTags(response.data);
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
            })
            .finally(f => {
                setLoading(false);
            }
            );
        };

        setLoading(true);
        fetchTemplates();
        fetchTags();

    }, []);

    if(loading){
        return <div>Loading....</div>
    }

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
