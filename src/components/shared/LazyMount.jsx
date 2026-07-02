import { useEffect, useRef, useState } from 'react';

export default function LazyMount({
    children,
    placeholder = null,
    rootMargin = '400px 0px',
    threshold = 0,
    once = true,
    intrinsicSize = '800px 1px',
}) {
    const containerRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return undefined;

        if (shouldRender && once) return undefined;

        if (typeof IntersectionObserver === 'undefined') {
            setShouldRender(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;
                if (entry.isIntersecting) {
                    setShouldRender(true);
                    if (once) observer.disconnect();
                }
            },
            { rootMargin, threshold }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [rootMargin, threshold, once, shouldRender]);

    const containerStyle = {
        // Skip rendering work for offscreen content (big win for Lighthouse main-thread work).
        // Unsupported browsers will ignore these properties.
        contentVisibility: 'auto',
        containIntrinsicSize: intrinsicSize,
        contain: 'layout style paint',
    };

    return (
        <div ref={containerRef} style={containerStyle}>
            {shouldRender ? children : placeholder}
        </div>
    );
}
