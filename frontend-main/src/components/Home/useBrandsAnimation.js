import { useEffect, useRef, useState } from "react";

export default function useBrandsAnimation(brands, isPaused, itemWidth, options = {}) {
  const { isActive = true } = options;
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(!!media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;
    if (prefersReducedMotion) return undefined;
    if (isPaused) return undefined;
    if (itemWidth === 0 || brands.length === 0) return undefined;
    if (!sliderRef.current) return undefined;

    // Throttle to ~30fps to reduce main-thread work.
    const minFrameMs = 33;

    const animate = (now) => {
      if (!sliderRef.current) return;

      const last = lastFrameTimeRef.current || 0;
      const delta = now - last;
      if (delta >= minFrameMs) {
        lastFrameTimeRef.current = now;

        const baseSpeedPerFrame = 0.3;
        const normalized = delta / 16.67;
        const speed = baseSpeedPerFrame * normalized;
        positionRef.current += speed;

        const singleSetWidth = itemWidth * brands.length;
        if (singleSetWidth > 0 && positionRef.current >= singleSetWidth) {
          positionRef.current = 0;
        }

        sliderRef.current.style.transform = `translateX(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [isActive, prefersReducedMotion, isPaused, itemWidth, brands.length]);

  return sliderRef;
}
