import React from 'react';
import { ListGroup } from 'react-bootstrap';

const CommentItem = ({ comment }) => {
    return (
        <ListGroup.Item className="d-flex align-items-start">
            <div>
                <div >
                    <strong>{comment.author}</strong>{' '}
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {new Date(comment.timestamp).toLocaleString()}
                    </span>
                </div>
                <div>{comment.text}</div>
            </div>
        </ListGroup.Item>
    );
};

export default CommentItem;
