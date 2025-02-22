import React from 'react';
import { Card, Image  } from 'react-bootstrap';

const GeneralSettings = ({ template }) => (
    <Card className="mb-3">
        <Card.Header>General Settings</Card.Header>
        <Card.Body>
            <p>
                <strong>Title:</strong> {template.title}
            </p>
            <p>
                <strong>Description:</strong> {template.description}
            </p>
            {template.photoUrl && (
                <div className="mt-3">
                    <Image
                        src={template.photoUrl} 
                        alt="Template Photo"
                        style={{ width: '400px', height: '300px', objectFit: 'cover' }} />
                </div>
            )}
        </Card.Body>
    </Card>
);

export default GeneralSettings;
