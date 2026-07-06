import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * SEO Component - Comprehensive SEO optimization for all pages
 * @param {string} title - Page title
 * @param {string} description - Page description (max 160 chars)
 * @param {string} keywords - SEO keywords
 * @param {string} image - Open Graph image URL
 * @param {string} type - Open Graph type (website, product, article)
 * @param {object} structuredData - JSON-LD structured data
 * @param {boolean} noindex - Prevent indexing
 * @param {string} canonical - Canonical URL
 */
export default function SEO({
    title = 'Sume Traders - Quality Fashion Online',
    description = 'Shop quality clothing at Sume Traders. Find outfits for every occasion with free shipping on orders over ৳500.',
    keywords = 'online shopping, fashion, clothing, Bangladesh',
    image = '/logo.jpeg',
    type = 'website',
    structuredData,
    noindex = false,
    canonical
}) {
    const router = useRouter();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sumetraders.com';
    const currentUrl = `${siteUrl}${router.asPath}`;
    const canonicalUrl = canonical || currentUrl;

    // Default structured data for organization
    const defaultStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Sume Traders',
        description: 'Premium Online Fashion Store',
        url: siteUrl,
        logo: `${siteUrl}/logo.jpeg`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+880-XXX-XXXXXX',
            contactType: 'Customer Service',
            areaServed: 'BD',
            availableLanguage: 'Bengali'
        },
        sameAs: [
            'https://www.facebook.com/sumetraders',
            'https://www.instagram.com/sumetraders',
            'https://twitter.com/sumetraders'
        ]
    };

    const fullTitle = title.includes('Sume Traders') ? title : `${title} | Sume Traders`;
    const ogImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Sume Traders" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Sume Traders" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:creator" content="@sumetraders" />

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Sume Traders" />

            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
            <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

            {/* Language */}
            <meta httpEquiv="content-language" content="en" />
            <link rel="alternate" hrefLang="en" href={currentUrl} />

            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData)
                    }}
                />
            )}

            {/* Default Organization Schema */}
            {!structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(defaultStructuredData)
                    }}
                />
            )}
        </Head>
    );
}
