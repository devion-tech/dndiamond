"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function CategoryCarousel() {
  const dispatch = useDispatch();

  const { items: apiCategories, loading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading || !apiCategories?.length) return null;

  return (
    <section className="py-12">
      <Swiper
        modules={[Navigation]}
        navigation={false}
        spaceBetween={24}
        breakpoints={{
          0: {
            slidesPerView: 1.3,
          },
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
      >
        {apiCategories.map((cat) => (
          <SwiperSlide  key={cat._id}>
            <Link
              href={`/category/${cat.slug}`}
              className="group block"
            >
              <div className="overflow-hidden bg-neutral-100 aspect-square">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-center uppercase tracking-[0.25em] text-xs font-medium text-neutral-800">
                {cat.name}
              </h3>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}