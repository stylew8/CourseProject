import React from 'react';
import { Card } from 'react-bootstrap';

const AggregationResults = () => (
    <Card className="mb-3">
        <Card.Header>Aggregation of Results</Card.Header>
        <Card.Body>
            <p>
                Aggregation metrics (e.g., averages, most common answers) will be displayed here.
            </p>
        </Card.Body>
    </Card>
);

export default AggregationResults;
