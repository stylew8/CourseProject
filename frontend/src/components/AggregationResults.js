import React from 'react';
import { Card, Table } from 'react-bootstrap';

const AggregationResults = ({ aggregationResults }) => {
    const { totalAnswers, mostFrequentAnswers, aggregationResults: detailedResults } = aggregationResults;

    return (
        <Card className="mb-3">
            <Card.Header>Aggregation of Results</Card.Header>
            <Card.Body>
                <h5>Total Answers Submitted: {totalAnswers}</h5>
                {detailedResults.length === 0 ? (
                    <p>No aggregation data available.</p>
                ) : (
                    <>
                        <h6>Most Frequent Answers</h6>
                        {mostFrequentAnswers.length > 0 ? (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Question ID</th>
                                            <th>Answer</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mostFrequentAnswers.map((result, index) => (
                                            <tr key={index}>
                                                <td>{result.questionId}</td>
                                                <td>{result.answerValue}</td>
                                                <td>{result.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <p>No frequent answer data available.</p>
                        )}
                    </>
                )}
            </Card.Body>
        </Card>
    );
};


export default AggregationResults;
