const getSiteBaseUrl = (req) => {
    const proto = (req?.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
    const host = (req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim();

    if (host) return `${proto}://${host}`;
    return process.env.NEXT_PUBLIC_SITE_URL || "https://www.sumetraders.shop";
};

const escapeXml = (value = "") => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const toIso = (value) => {
    try {
        const d = value ? new Date(value) : null;
        if (!d || Number.isNaN(d.getTime())) return null;
        return d.toISOString();
    } catch {
        return null;
    }
};

const buildUrlsetXml = (urls = []) => {
    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map(({ loc, lastmod }) => {
                const safeLoc = escapeXml(loc);
                const safeLastmod = lastmod ? escapeXml(lastmod) : null;
                return `  <url><loc>${safeLoc}</loc>${safeLastmod ? `<lastmod>${safeLastmod}</lastmod>` : ""}</url>`;
            })
            .join("\n") +
        `\n</urlset>`;
};

const fetchJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${url} (${res.status})`);
    }
    return res.json();
};

export async function getServerSideProps({ res, req, params }) {
    const baseUrl = getSiteBaseUrl(req);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const page = Number.parseInt(String(params?.page || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;

    const data = await fetchJson(`${apiBase}/seo/sitemap/products?limit=5000&page=${safePage}`);
    const items = Array.isArray(data?.items) ? data.items : [];

    const urls = items
        .map((item) => {
            const slug = item?.slug;
            if (!slug) return null;
            return {
                loc: `${baseUrl}/product/${encodeURIComponent(String(slug))}`,
                lastmod: toIso(item?.lastmod),
            };
        })
        .filter(Boolean);

    const xml = buildUrlsetXml(urls);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.write(xml);
    res.end();

    return { props: {} };
}

export default function ProductsSitemap() {
    return null;
}
