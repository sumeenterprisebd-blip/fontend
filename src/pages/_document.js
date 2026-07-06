import Document, { Html, Head, Main, NextScript } from "next/document";
import { isTrackingEnabled } from "@/config/tracking";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    return Document.getInitialProps(ctx);
  }

  render() {
    const trackingEnabled = isTrackingEnabled();

    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
          {/* Favicon and App Icons - Essential for branding and browser tab display */}
          <link rel="icon" href="/logo.jpeg" type="image/jpeg" sizes="any" />
          <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
          <link rel="apple-touch-icon" href="/logo.jpeg" sizes="180x180" />

          {/* Preconnect to critical origins for faster resource loading */}
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />

          {/* DNS Prefetch for third-party resources (lower priority) */}
          {trackingEnabled && (
            <>
              <link rel="dns-prefetch" href="https://www.facebook.com" />
              <link rel="dns-prefetch" href="https://scontent.xx.fbcdn.net" />
              <link rel="dns-prefetch" href="https://connect.facebook.net" />
              <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            </>
          )}

          {/* Critical CSS for above-the-fold content and LCP optimization */}
          <style dangerouslySetInnerHTML={{
            __html: `
            /* Prevent FOIT (Flash of Invisible Text) */
            body { 
              font-display: swap;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            }
            
            /* Prevent layout shift for hero section (LCP element) */
            .hero-section { 
              min-height: 100vh;
              contain: layout;
            }
            
            /* Reserve space for images to prevent CLS */
            img[loading="lazy"] { 
              min-height: 200px;
              content-visibility: auto;
            }
            
            /* Optimize rendering performance */
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Reduce layout thrashing */
            [class*="container"] {
              contain: layout style;
            }
          `
          }} />

        </Head>
        <body className="antialiased" suppressHydrationWarning>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
