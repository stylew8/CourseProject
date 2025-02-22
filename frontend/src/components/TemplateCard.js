import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { deleteTemplate } from '../api/templateService';

const TemplateCard = ({ template, isDashboard = false }) => {
    const onDelete = async () => {
        try {
            if (window.confirm("Are you sure?")) {
                await deleteTemplate(template.id); 
            }
        } catch (error) {
            console.error('Exception during deleting template:', error.response?.data || error.message);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{template.title}</Card.Title>
                <Card.Text>{template.description}</Card.Text>
                <Button variant="primary" href={`/template/${template.id}`}>
                    View Template
                </Button>
                {isDashboard && (
                    <>
                        <Button variant="outline-primary" className="mx-2" href={`/edit-template/${template.id}`}>
                            Edit
                        </Button>
                        <Button variant="outline-danger" onClick={onDelete}>
                            Delete
                        </Button>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default TemplateCard;
