import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function EventSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Slider {...settings} className="slider">
            <div>
                <img src="/assets/images/event1.jpg" alt="Event 1" />
                <div className="carousel-caption">
                    <h3>Memorable Weddings</h3>
                </div>
            </div>
            <div>
                <img src="/assets/images/event2.jpg" alt="Event 2" />
                <div className="carousel-caption">
                    <h3>Corporate Events</h3>
                </div>
            </div>
        </Slider>
    );
}

export default EventSlider;