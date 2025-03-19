import React from 'react';

function Blog() {
    return (
        <div className="container">
            <h1 className="my-4">Blog</h1>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Top Event Trends in 2025</h5>
                            <p className="card-text">Discover the latest trends in event planning.</p>
                            <a href="#" className="btn btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
                {/* Thêm bài viết khác */}
            </div>
        </div>
    );
}

export default Blog;