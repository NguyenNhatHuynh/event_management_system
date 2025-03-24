// frontend/src/pages/admin/AddBlog.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../assets/styles/Editor.css';
import { useNavigate } from 'react-router-dom';

function AddBlog() {
    const [eventTypes, setEventTypes] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [blog, setBlog] = useState({
        title: '',
        content: '',
        category: '',
        status: 'pending',
        image: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/event-types/public');
                setEventTypes(response.data);
            } catch (error) {
                toast.error('Lỗi khi lấy danh sách thể loại sự kiện: ' + (error.response?.data?.message || error.message));
            }
        };
        fetchEventTypes();
    }, []);

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
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập để tiếp tục!');
            return;
        }

        const formData = new FormData();
        formData.append('title', blog.title);
        formData.append('content', blog.content);
        formData.append('category', blog.category);
        formData.append('status', blog.status);
        if (blog.image) {
            formData.append('image', blog.image);
        }

        try {
            await axios.post('http://localhost:5000/api/blogs', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Thêm bài viết thành công!');
            navigate('/admin/blogs');
        } catch (error) {
            toast.error('Lỗi khi lưu bài viết: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <Container className="mt-5 editor-container">
            <h2>THÊM BÀI VIẾT</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={blog.title}
                        onChange={handleInputChange}
                        required
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
                    >
                        <option value="">Chọn danh mục</option>
                        {eventTypes.map((type) => (
                            <option key={type._id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                        name="status"
                        value={blog.status}
                        onChange={handleInputChange}
                    >
                        <option value="pending">Đang chờ phê duyệt</option>
                        <option value="approved">Đã phê duyệt</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Hình ảnh thumbnail</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                    />
                </Form.Group>
                <Button variant="secondary" onClick={() => navigate('/admin/blogs')} className="me-2">
                    Quay lại
                </Button>
                <Button variant="primary" type="submit">
                    Thêm
                </Button>
            </Form>
            <ToastContainer position="top-right" autoClose={3000} />
        </Container>
    );
}

export default AddBlog;