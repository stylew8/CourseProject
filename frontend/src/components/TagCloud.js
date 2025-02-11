import React from 'react';
import { Badge } from 'react-bootstrap';

const TagCloud = ({ tags }) => (
    <div className="tag-cloud">
        {tags.map((tag, index) => (
            <Badge key={index} pill bg="info" className="me-2">
                {tag}
            </Badge>
        ))}
    </div>
);

export default TagCloud;