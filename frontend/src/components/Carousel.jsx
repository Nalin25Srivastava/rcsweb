import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSlides } from '../store/slices/carouselSlice';

const Carousel = () => {
    const dispatch = useDispatch();
    const { slides, isLoading } = useSelector((state) => state.carousel);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(fetchSlides());
    }, [dispatch]);

    const prevSlide = () => {
        if (!slides || slides.length === 0) return;
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        if (!slides || slides.length === 0) return;
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    useEffect(() => {
        if (slides && slides.length > 0) {
            const slideInterval = setInterval(nextSlide, 5000);
            return () => clearInterval(slideInterval);
        }
    }, [currentIndex, slides]);

    const isVideo = (url) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg)$/i) || url.startsWith('data:video');
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!slides || slides.length === 0) return null;

    return (
        <div className="relative h-[60vh] md:h-[75vh] lg:h-screen w-full group overflow-hidden">
            {/* Slides */}
            <div className="w-full h-full relative flex items-center justify-center transition-all">
                {isVideo(slides[currentIndex].url) ? (
                    <video 
                        key={slides[currentIndex].url}
                        src={slides[currentIndex].url} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div
                        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                        className="absolute inset-0 w-full h-full bg-center bg-cover duration-700 ease-in-out bg-no-repeat"
                    ></div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                        {slides[currentIndex].title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 drop-shadow-md font-medium">
                        {slides[currentIndex].subtitle}
                    </p>
                    <Link to="/services">
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl uppercase tracking-widest text-sm">
                            Explore Our Services
                        </button>
                    </Link>
                </div>
            </div>

            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-all">
                <ChevronLeft onClick={prevSlide} size={40} />
            </div>

            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-all">
                <ChevronRight onClick={nextSlide} size={40} />
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center py-2 space-x-3">
                {slides.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => setCurrentIndex(slideIndex)}
                        className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
                            currentIndex === slideIndex ? 'bg-emerald-500 w-8' : 'bg-white/50'
                        }`}
                    ></div>
                ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white animate-bounce opacity-80">
                <p className="text-sm font-medium mb-1">Scroll Down</p>
                <div className="w-1 h-6 bg-white mx-auto rounded-full"></div>
            </div>
        </div>
    );
};

export default Carousel;
