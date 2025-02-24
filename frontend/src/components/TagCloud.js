import React from 'react';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TagCloud = ({ tags }) => (
    <div className="tag-cloud">
        {tags.map((tag, index) => (
            <Link key={index} to={`/search?q=${encodeURIComponent(tag)}`} style={{ textDecoration: 'none' }}>
                <Badge pill bg="info" className="me-2">
                    {tag}
                </Badge>
            </Link>
        ))}
    </div>
);

export default TagCloud;
