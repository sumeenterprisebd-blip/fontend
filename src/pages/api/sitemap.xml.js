// pages/api/sitemap.xml.js
export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sumetraders.shop";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    // Fetch dynamic data - products
    let products = [];
    try {
      const response = await fetch(
        `${apiUrl}/api/products?limit=1000&isActive=true`
      );
      const data = await response.json();
      products = data.products || [];
    } catch (error) {
    }

    // Static pages with priorities
    const staticPages = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "/shop", priority: "0.9", changefreq: "daily" },
      { path: "/new-arrivals", priority: "0.9", changefreq: "daily" },
      { path: "/contact", priority: "0.7", changefreq: "monthly" },
      { path: "/orders/track", priority: "0.6", changefreq: "monthly" },
      { path: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
      { path: "/terms-of-service", priority: "0.5", changefreq: "yearly" },
    ];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("")}
  ${products
    .map((product) => {
      const productImages = product.images || [];
      const imageXml = productImages
        .slice(0, 3)
        .map(
          (img) => `
    <image:image>
      <image:loc>${img}</image:loc>
      <image:title>${product.name}</image:title>
    </image:image>`
        )
        .join("");

      return `
  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${product.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageXml}
  </url>`;
    })
    .join("")}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate"
    );
    res.status(200).send(sitemap);
  } catch (error) {
    res.status(500).send("Error generating sitemap");
  }
}
