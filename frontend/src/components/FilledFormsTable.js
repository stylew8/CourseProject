import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FilledFormsTable = ({ filledForms }) => (
    <Card className="mb-3">
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Answers</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filledForms.map((form) => (
                        <tr key={form.id}>
                            {form.user}
                            <td>{form.userName || "Unknown User"}</td>
                            <td>
                                {form.answers && form.answers.length > 0
                                    ? form.answers.map((answer, index) => (
                                        <div key={index}>
                                            <strong>Question: </strong>
                                            {answer.questionTextSnapshot} <br />
                                            <strong>Answer: </strong>{answer.answerValue}
                                        </div>
                                    ))
                                    : "No answers"}
                            </td>
                            <td>
                                <Link to={`/edit-form/${form.id}`}>
                                    <Button variant="outline-primary" size="sm">
                                        Edit
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </Card>
);

export default FilledFormsTable;
