const getSiteBaseUrl = (req) => {
    const proto = (req?.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
    const host = (req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim();

    if (host) return `${proto}://${host}`;
    return process.env.NEXT_PUBLIC_SITE_URL || "https://www.deshwear.shop";
};

const escapeXml = (value = "") => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

const buildSitemapIndexXml = (locs = []) => {
    const now = new Date().toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        locs
            .map((loc) => {
                const safeLoc = escapeXml(loc);
                return `  <sitemap><loc>${safeLoc}</loc><lastmod>${now}</lastmod></sitemap>`;
            })
            .join("\n") +
        `\n</sitemapindex>`;
};

const fetchJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${url} (${res.status})`);
    }
    return res.json();
};

export async function getServerSideProps({ res, req }) {
    const baseUrl = getSiteBaseUrl(req);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    // Discover how many paginated sitemap files we need.
    const [productsMeta, categoriesMeta] = await Promise.all([
        fetchJson(`${apiBase}/seo/sitemap/products?limit=1&page=1`),
        fetchJson(`${apiBase}/seo/sitemap/categories?limit=1&page=1`),
    ]);

    const productPages = Math.max(1, Number(productsMeta?.pages || 1));
    const categoryPages = Math.max(1, Number(categoriesMeta?.pages || 1));

    const locs = [];
    for (let p = 1; p <= productPages; p += 1) {
        locs.push(`${baseUrl}/sitemaps/products/${p}.xml`);
    }
    for (let p = 1; p <= categoryPages; p += 1) {
        locs.push(`${baseUrl}/sitemaps/categories/${p}.xml`);
    }

    const xml = buildSitemapIndexXml(locs);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.write(xml);
    res.end();

    return { props: {} };
}

export default function SitemapIndex() {
    return null;
}
