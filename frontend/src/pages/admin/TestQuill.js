// frontend/src/pages/admin/TestQuill.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TestQuill() {
    const [content, setContent] = useState('');

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Thử nghiệm ReactQuill</h2>
            <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                theme="snow"
                placeholder="Nhập nội dung..."
                style={{ height: '200px', marginBottom: '50px' }}
            />
            <div>
                <h3>Nội dung đã nhập:</h3>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}

export default TestQuill;