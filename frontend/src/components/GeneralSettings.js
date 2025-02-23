import React from 'react';
import { Card, Image, Row, Col } from 'react-bootstrap';
import MarkdownPreviewComponent from './MarkdownPreview.js';
import TagCloud from './TagCloud';

const GeneralSettings = ({ template }) => (
    <Card className="mb-3">
        <Card.Header>General Settings</Card.Header>
        <Card.Body>
            <Row>
                <Col md={6}>
                    <p>
                        <strong>Title:</strong> {template.title}
                    </p>
                    <p>
                        <strong>Topic:</strong> {template.topic}
                    </p>
                    {template.photoUrl && (
                        <div className="mt-3">
                            <Image
                                src={template.photoUrl}
                                alt="Template Photo"
                                style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </Col>
                <Col md={6}>
                    <strong>Description:</strong>
                    <MarkdownPreviewComponent markdownText={template.description} />

                    <div className="mt-3">
                        <TagCloud tags={template.tags.map(x => x.label)} />
                    </div>
                </Col>
            </Row>

        </Card.Body>
    </Card>
);

export default GeneralSettings;
