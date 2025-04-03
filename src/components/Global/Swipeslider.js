import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

const base_url = "http://162.252.85.40/";

const CategorySlider = ({ slidedet, onCategorySelect, onSlideChange }) => {
  const location = useLocation();

  return (
    <div className="slider-container mt-1">
      {location.pathname === "/products" && (
        <Link to='/add-product-category'>
          <p className="text-start m-0 fs-5">
            <i className="bi bi-plus-circle-fill"></i>
          </p>
        </Link>
      )}

      <Swiper
        effect="coverflow"
        grabCursor={true}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Navigation, Pagination]}
        className="swiper-container"
        centeredSlides={true}
        slidesPerView={3}
        initialSlide={1}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1.1,
          slideShadows: false,
        }}
        onSlideChange={(swiper) => {
          if (onSlideChange) {
            const activeCategory = slidedet[swiper.activeIndex];
            if (activeCategory?.id !== undefined) {
              onSlideChange(activeCategory.id);
            }
          }
        }}
      >
        {slidedet.map((category, index) => (
          <SwiperSlide key={category.id !== undefined ? category.id : `index-${index}`}>
            <div className="slide-content">
              {category.imagetype === "local" ? (
                category.image && (
                  category.url ? (
                    <Link to={category.url} rel="noopener noreferrer">
                      <img src={category.image} alt={category.title || 'Category'} />
                    </Link>
                  ) : (
                    <img src={category.image} alt={category.title || 'Category'} />
                  )
                )
              ) : (
                category.image && (
                  category.url ? (
                    <Link to={category.url} rel="noopener noreferrer">
                      <img src={`${base_url}${category.image}`} alt={category.title || 'Category'} />
                    </Link>
                  ) : (
                    <img src={`${base_url}${category.image}`} alt={category.title || 'Category'} />
                  )
                )
              )}



              {category.title && <h6 className="my-3">{category.title}</h6>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
