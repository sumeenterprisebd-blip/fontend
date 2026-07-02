const getSiteBaseUrl = (req) => {
    const proto = (req?.headers?.["x-forwarded-proto"] || "https").split(",")[0].trim();
    const host = (req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim();

    if (host) return `${proto}://${host}`;
    return process.env.NEXT_PUBLIC_SITE_URL || "https://www.deshwear.shop";
};

export async function getServerSideProps({ res, req }) {
    const baseUrl = getSiteBaseUrl(req);

    // Keep rules aligned with the existing robots configuration.
    const lines = [
        "User-agent: *",
        "Allow: /",
        "",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Disallow: /profile/",
        "Disallow: /cart/",
        "Disallow: /checkout/",
        "",
        "# Sitemap",
        `Sitemap: ${baseUrl}/sitemap.xml`,
        "",
        "# Crawl-delay",
        "Crawl-delay: 1",
        "",
        "# Google Bot",
        "User-agent: Googlebot",
        "Allow: /",
        "Disallow: /admin/",
        "Disallow: /api/",
        "",
        "# Bing Bot",
        "User-agent: Bingbot",
        "Allow: /",
        "Disallow: /admin/",
        "Disallow: /api/",
        "",
        "# Social Media Crawlers",
        "User-agent: facebookexternalhit",
        "Allow: /",
        "",
        "User-agent: Twitterbot",
        "Allow: /",
        "",
    ];

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.write(lines.join("\n"));
    res.end();

    return { props: {} };
}

export default function Robots() {
    return null;
}
