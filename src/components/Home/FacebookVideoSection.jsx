import { FiVideo } from '@react-icons/all-files/fi/FiVideo';
import { useFacebookVideos } from '@/hooks/useFacebookVideos';
import { useState, useEffect, useRef } from 'react';

export default function FacebookVideoSection() {
    const { videos, loading } = useFacebookVideos();
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { rootMargin: '100px' } // Load 100px before entering viewport
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);









    // Removed Facebook video section component
}
