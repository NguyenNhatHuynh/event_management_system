import React from 'react';

function Portfolio() {
    return (
        <div className="container">
            <h1 className="my-4">Portfolio</h1>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card">
                        <img src="/path-to-image.jpg" className="card-img-top" alt="Event" />
                        <div className="card-body">
                            <h5 className="card-title">Wedding 2023</h5>
                            <p className="card-text">A beautiful wedding at the beach.</p>
                        </div>
                    </div>
                </div>
                {/* Thêm các sự kiện khác */}
            </div>
        </div>
    );
}

export default Portfolio;