import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HeaderSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // При сабмите переходим на страницу поиска с параметром запроса
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="d-flex">
            <Form.Control
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '250px' }}
            />
        </Form>
    );
};

export default HeaderSearch;
