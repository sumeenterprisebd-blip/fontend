export const scheduleWork = (callback, options = {}) => {
    if (typeof window === 'undefined') return;

    if ('scheduler' in window && typeof window.scheduler?.scheduleCallback === 'function') {
        window.scheduler.scheduleCallback(() => {
            callback();
        });
        return;
    }

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, options);
        return;
    }

    setTimeout(callback, 0);
};
