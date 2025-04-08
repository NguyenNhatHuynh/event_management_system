import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../assets/styles/Editor.css';
import { useNavigate, useParams } from 'react-router-dom';

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [eventTypes, setEventTypes] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [blog, setBlog] = useState({
        title: '',
        content: '',
        category: '',
        status: 'pending',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchEventTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/event-types/public');
                if (isMounted) {
                    // Kiểm tra dữ liệu trả về
                    const data = response.data;
                    // Nếu dữ liệu là mảng trực tiếp
                    if (Array.isArray(data)) {
                        setEventTypes(data);
                    }
                    // Nếu dữ liệu là object chứa eventTypes
                    else if (data && Array.isArray(data.eventTypes)) {
                        setEventTypes(data.eventTypes);
                    } else {
                        setEventTypes([]);
                        setError('Danh sách thể loại sự kiện không hợp lệ');
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setError('Lỗi khi lấy danh sách thể loại sự kiện: ' + (error.response?.data?.message || error.message));
                    toast.error('Lỗi khi lấy danh sách thể loại sự kiện: ' + (error.response?.data?.message || error.message));
                    setEventTypes([]); // Đảm bảo eventTypes là mảng rỗng nếu có lỗi
                }
            }
        };

        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Vui lòng đăng nhập để tiếp tục!');
                }
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (isMounted) {
                    const blogData = response.data;
                    setBlog(blogData);

                    if (blogData.content) {
                        const contentBlock = htmlToDraft(blogData.content);
                        if (contentBlock) {
                            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                            const editorState = EditorState.createWithContent(contentState);
                            setEditorState(editorState);
                        }
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setError('Lỗi khi lấy bài viết: ' + (error.response?.data?.message || error.message));
                    toast.error('Lỗi khi lấy bài viết: ' + (error.response?.data?.message || error.message));
                }
            }
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchEventTypes(), fetchBlog()]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlog({ ...blog, [name]: value });
    };

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        const content = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
        setBlog({ ...blog, content });
    };

    const handleImageChange = (e) => {
        setBlog({ ...blog, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Vui lòng đăng nhập để tiếp tục!');
            toast.error('Vui lòng đăng nhập để tiếp tục!');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', blog.title);
        formData.append('content', blog.content);
        formData.append('category', blog.category);
        formData.append('status', blog.status);
        if (blog.image && typeof blog.image !== 'string') {
            formData.append('image', blog.image);
        } else if (blog.image) {
            formData.append('image', blog.image); // Send the existing image path if no new image is uploaded
        }

        try {
            await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Cập nhật bài viết thành công!');
            navigate('/admin/blogs');
        } catch (error) {
            setError('Lỗi khi cập nhật bài viết: ' + (error.response?.data?.message || error.message));
            toast.error('Lỗi khi cập nhật bài viết: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 editor-container">
            <h2>SỬA BÀI VIẾT</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={blog.title}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nội dung</Form.Label>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        wrapperClassName="editor-wrapper"
                        editorClassName="editor-main"
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                            inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
                            image: {
                                uploadCallback: async (file) => {
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    try {
                                        const token = localStorage.getItem('token');
                                        const response = await axios.post('http://localhost:5000/api/blogs/upload-image', formData, {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                                'Content-Type': 'multipart/form-data',
                                            },
                                        });
                                        return { data: { link: response.data.url } };
                                    } catch (error) {
                                        toast.error('Lỗi khi upload hình ảnh: ' + (error.response?.data?.message || error.message));
                                        return { data: { link: '' } };
                                    }
                                },
                                previewImage: true,
                                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                alt: { present: true, mandatory: false },
                            },
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Danh mục</Form.Label>
                    <Form.Select
                        name="category"
                        value={blog.category}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Chọn danh mục</option>
                        {eventTypes.length > 0 ? (
                            eventTypes.map((type) => (
                                <option key={type._id} value={type.name}>
                                    {type.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>Không có danh mục nào</option>
                        )}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                        name="status"
                        value={blog.status}
                        onChange={handleInputChange}
                        disabled={loading}
                    >
                        <option value="pending">Đang chờ phê duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group class="mb-3">
                    <Form.Label>Hình ảnh thumbnail</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                    {blog.image && typeof blog.image === 'string' && (
                        <img
                            src={`http://localhost:5000${blog.image}`}
                            alt="Preview"
                            style={{ width: '100px', marginTop: '10px' }}
                            onError={(e) => {
                                console.log(`Failed to load preview image: http://localhost:5000${blog.image}`);
                                e.target.style.display = 'none';
                            }}
                        />
                    )}
                </Form.Group>
                <Button variant="secondary" onClick={() => navigate('/admin/blogs')} className="me-2" disabled={loading}>
                    Quay lại
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
            </Form>
            <ToastContainer position="top-right" autoClose={3000} />
        </Container>
    );
}

export default EditBlog;