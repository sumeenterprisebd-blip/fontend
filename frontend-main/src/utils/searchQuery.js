export const sanitizeSearchQuery = (raw) => {
    if (raw === null || raw === undefined) return "";

    const text = String(raw)
        .replace(/\s+/g, " ")
        .trim();

    // Keep consistent with backend guardrails
    return text.length > 64 ? text.slice(0, 64).trim() : text;
};
