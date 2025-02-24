import React, { useState, useEffect, useContext, useRef } from 'react';
import { Card, Button, ListGroup, Form } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { notifyError, notifySuccess } from '../../utils/notification';

const Comments = ({ templateId }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const commentsRef = useRef(null);

    const fetchCommentsAndLikes = async () => {
        try {
            const responseTemplate = await axiosInstance.get(`/likes/${templateId}`);
            setLikes(responseTemplate.data.likes || 0);
            setUserLiked(responseTemplate.data.userLiked);
            const responseComments = await axiosInstance.get(`/comments/${templateId}`);
            setComments(responseComments.data);
        } catch (error) {
            console.error('Error fetching comments/likes:', error.response?.data || error.message);
            notifyError('Error fetching comments and likes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommentsAndLikes();
        const intervalId = setInterval(fetchCommentsAndLikes, 3000);
        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateId]);

    useEffect(() => {
        if (commentsRef.current) {
            commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
        }
    }, [comments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const payload = { text: newComment };
            const response = await axiosInstance.post(`/comments/${templateId}`, payload);
            setComments([...comments, response.data]);
            setNewComment('');
            notifySuccess('Comment added successfully!');
        } catch (error) {
            console.error('Error adding comment:', error.response?.data || error.message);
            notifyError('Error adding comment. Please try again.');
        }
    };

    const handleLike = async () => {
        try {
            if (!userLiked) {
                await axiosInstance.post(`/likes/${templateId}/like`);
                setLikes(likes + 1);
                setUserLiked(true);
            } else {
                await axiosInstance.post(`/likes/${templateId}/unlike`);
                setLikes(likes - 1);
                setUserLiked(false);
            }
        } catch (error) {
            console.error('Error updating like:', error.response?.data || error.message);
            notifyError('Error updating like. Please try again.');
        }
    };

    if (loading) return <div>Loading comments...</div>;

    return (
        <div className="my-4">
            <Card className="p-3 mb-3">
                <div className="d-flex gap-3 align-items-center">
                    {isAuthenticated && (
                        <Button variant={userLiked ? 'success' : 'outline-success'} onClick={handleLike}>
                            {userLiked ? 'Unlike' : 'Like'}
                        </Button>
                    )}
                    <span>Likes: {likes}</span>
                </div>
            </Card>
            <Card className="p-3">
                <Form.Group controlId="newComment">
                    {comments.length > 0 ? (
                        <ListGroup
                            ref={commentsRef}
                            className="mt-3"
                            style={{ maxHeight: '400px', overflowY: 'auto' }}
                        >
                            {comments.map((comment, index) => (
                                <ListGroup.Item key={index} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong>{comment.user?.userName || comment.user?.email || user.userName.split('@')[0]}</strong>
                                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div>{comment.text}</div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="mt-3">No comments yet.</p>
                    )}
                    {isAuthenticated && (
                        <>
                            <Form.Label className="mt-3">Add a comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment here..."
                                maxLength={250}
                            />
                            <div className="text-end text-muted mt-1">
                                {newComment.length}/250 characters
                            </div>
                            <Button variant="primary" onClick={handleAddComment} className="mt-2">
                                Post Comment
                            </Button>
                        </>
                    )}
                </Form.Group>
            </Card>
        </div>
    );
};

export default Comments;
