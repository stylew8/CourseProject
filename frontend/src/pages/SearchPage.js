import React, { useState, useEffect } from 'react';
import { Container, Form, ListGroup, Row, Col, Pagination } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialSort = searchParams.get('sort') || 'relevance';
    const initialPage = Number(searchParams.get('page')) || 1;

    const [query, setQuery] = useState(initialQuery);
    const [sortOrder, setSortOrder] = useState(initialSort);
    const [results, setResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);
    const [page, setPage] = useState(initialPage);

    const pageSize = 10; 
    const navigate = useNavigate();

    const handleSearch = async (q, sort, currentPage) => {
        if (!q.trim()) {
            setResults([]);
            setResultCount(0);
            return;
        }
        try {
            const response = await axiosInstance.get(
                `/search/search?q=${encodeURIComponent(q)}&sort=${sort}&page=${currentPage}&pageSize=${pageSize}`
            );
            setResults(response.data.templates);
            setResultCount(response.data.totalCount || response.data.templates.length);
        } catch (error) {
            console.error('Error searching templates:', error.response?.data || error.message);
        }
    };

    const debouncedSearch = debounce((q, sort, currentPage) => {
        handleSearch(q, sort, currentPage);
    }, 300);

    const onQueryChange = (e) => {
        const q = e.target.value;
        setQuery(q);
        setSearchParams({ q, sort: sortOrder, page: page });
        debouncedSearch(q, sortOrder, page);
    };

    const onSortChange = (e) => {
        const newSort = e.target.value;
        setSortOrder(newSort);
        setSearchParams({ q: query, sort: newSort, page: page });
        handleSearch(query, newSort, page);
    };

    const onPageChange = (newPage) => {
        setPage(newPage);
        setSearchParams({ q: query, sort: sortOrder, page: newPage });
        handleSearch(query, sortOrder, newPage);
    };

    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery, sortOrder, page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery]);

    const totalPages = Math.ceil(resultCount / pageSize);

    return (
        <Container className="mt-4">
            <h1>Search Templates</h1>
            <Form className="mb-3">
                <Row>
                    <Col xs={12} md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Search for templates..."
                            value={query}
                            onChange={onQueryChange}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Select value={sortOrder} onChange={onSortChange}>
                            <option value="relevance">Sort by Relevance</option>
                            <option value="titleAsc">Title: A to Z</option>
                            <option value="titleDesc">Title: Z to A</option>
                            <option value="dateDesc">Newest First</option>
                            <option value="dateAsc">Oldest First</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Form>
            <div className="mb-3">
                <strong>{resultCount}</strong> result{resultCount !== 1 && 's'} found
            </div>
            {results.length > 0 ? (
                <ListGroup>
                    {results.map((template) => (
                        <ListGroup.Item
                            key={template.id}
                            onClick={() => navigate(`/template/${template.id}`)}
                            style={{ cursor: 'pointer' }}
                            className="mb-2"
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>{template.title}</div>
                                {template.summary && (
                                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                                        {template.summary}
                                    </div>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>No results found.</p>
            )}
            {totalPages > 1 && (
                <Pagination className="mt-3">
                    <Pagination.First onClick={() => onPageChange(1)} disabled={page === 1} />
                    <Pagination.Prev onClick={() => onPageChange(page - 1)} disabled={page === 1} />
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <Pagination.Item
                                key={pageNum}
                                active={pageNum === page}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </Pagination.Item>
                        );
                    })}
                    <Pagination.Next onClick={() => onPageChange(page + 1)} disabled={page === totalPages} />
                    <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={page === totalPages} />
                </Pagination>
            )}
        </Container>
    );
};

export default SearchPage;
