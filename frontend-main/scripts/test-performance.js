#!/usr/bin/env node

/**
 * Performance Testing Script
 * Run this script to get a comprehensive performance report
 * 
 * Usage: node scripts/test-performance.js
 */

const https = require('https');
const http = require('http');

// Configuration
const TARGET_URL = process.env.SITE_URL || 'http://localhost:3000';
const LIGHTHOUSE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || '';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function checkScore(score, metric) {
    if (score >= 90) {
        return `${colors.green}✓ ${metric}: ${score} (Good)${colors.reset}`;
    } else if (score >= 50) {
        return `${colors.yellow}⚠ ${metric}: ${score} (Needs Improvement)${colors.reset}`;
    } else {
        return `${colors.red}✗ ${metric}: ${score} (Poor)${colors.reset}`;
    }
}

function checkWebVital(value, thresholds, metric, unit = 's') {
    const displayValue = unit === 's' ? (value / 1000).toFixed(2) : value.toFixed(3);

    if (value <= thresholds.good) {
        return `${colors.green}✓ ${metric}: ${displayValue}${unit} (Good)${colors.reset}`;
    } else if (value <= thresholds.needsImprovement) {
        return `${colors.yellow}⚠ ${metric}: ${displayValue}${unit} (Needs Improvement)${colors.reset}`;
    } else {
        return `${colors.red}✗ ${metric}: ${displayValue}${unit} (Poor)${colors.reset}`;
    }
}

async function runLighthouse(strategy) {
    try {
        log('\n📊 Running Lighthouse Performance Test...', colors.cyan);
        log(`Target: ${TARGET_URL}`, colors.blue);
        log(`Strategy: ${strategy}\n`, colors.blue);

        const keyParam = PAGESPEED_API_KEY ? `&key=${encodeURIComponent(PAGESPEED_API_KEY)}` : '';
        const url = `${LIGHTHOUSE_URL}?url=${encodeURIComponent(TARGET_URL)}&category=performance&strategy=${encodeURIComponent(strategy)}${keyParam}`;

        const response = await new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
                res.on('error', reject);
            }).on('error', reject);
        });

        if (!response.lighthouseResult) {
            const apiError = response?.error;
            log('❌ Failed to get Lighthouse results', colors.red);
            if (apiError?.message) {
                log(`   API error: ${apiError.message}`, colors.yellow);
            }
            if (!PAGESPEED_API_KEY) {
                log('   Tip: PageSpeed Insights may require an API key in some environments.', colors.yellow);
                log('   Set PAGESPEED_API_KEY and rerun.', colors.yellow);
            }
            return;
        }

        const { lighthouseResult } = response;
        const { categories, audits } = lighthouseResult;

        // Performance Score
        const perfScore = Math.round(categories.performance.score * 100);
        log('\n' + '='.repeat(50), colors.cyan);
        log('📈 PERFORMANCE SCORES', colors.cyan);
        log('='.repeat(50), colors.cyan);
        log(checkScore(perfScore, 'Performance'));

        // Core Web Vitals
        log('\n' + '='.repeat(50), colors.cyan);
        log('🎯 CORE WEB VITALS', colors.cyan);
        log('='.repeat(50), colors.cyan);

        // LCP
        if (audits['largest-contentful-paint']) {
            const lcpValue = audits['largest-contentful-paint'].numericValue;
            log(checkWebVital(lcpValue, { good: 2500, needsImprovement: 4000 }, 'LCP (Largest Contentful Paint)'));
        }

        // FID (using TBT as proxy)
        if (audits['total-blocking-time']) {
            const tbtValue = audits['total-blocking-time'].numericValue;
            log(checkWebVital(tbtValue, { good: 200, needsImprovement: 600 }, 'TBT (Total Blocking Time)', 'ms'));
        }

        // CLS
        if (audits['cumulative-layout-shift']) {
            const clsValue = audits['cumulative-layout-shift'].numericValue;
            log(checkWebVital(clsValue, { good: 0.1, needsImprovement: 0.25 }, 'CLS (Cumulative Layout Shift)', ''));
        }

        // Additional Metrics
        log('\n' + '='.repeat(50), colors.cyan);
        log('⚡ ADDITIONAL METRICS', colors.cyan);
        log('='.repeat(50), colors.cyan);

        if (audits['first-contentful-paint']) {
            const fcpValue = audits['first-contentful-paint'].numericValue;
            log(checkWebVital(fcpValue, { good: 1800, needsImprovement: 3000 }, 'FCP (First Contentful Paint)'));
        }

        if (audits['speed-index']) {
            const siValue = audits['speed-index'].numericValue;
            log(checkWebVital(siValue, { good: 3400, needsImprovement: 5800 }, 'SI (Speed Index)'));
        }

        if (audits['interactive']) {
            const ttiValue = audits['interactive'].numericValue;
            log(checkWebVital(ttiValue, { good: 3800, needsImprovement: 7300 }, 'TTI (Time to Interactive)'));
        }

        // Opportunities
        log('\n' + '='.repeat(50), colors.cyan);
        log('💡 TOP OPPORTUNITIES', colors.cyan);
        log('='.repeat(50), colors.cyan);

        const opportunities = Object.values(audits)
            .filter(audit => audit.details && audit.details.type === 'opportunity')
            .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
            .slice(0, 5);

        opportunities.forEach((opp, index) => {
            const savings = (opp.numericValue / 1000).toFixed(2);
            log(`${index + 1}. ${opp.title}: ${savings}s potential savings`, colors.yellow);
        });

        // Recommendations
        log('\n' + '='.repeat(50), colors.cyan);
        log('📋 RECOMMENDATIONS', colors.cyan);
        log('='.repeat(50), colors.cyan);

        if (perfScore < 90) {
            log('• Review the opportunities listed above', colors.yellow);
            log('• Check browser caching configuration', colors.yellow);
            log('• Verify image optimization is working', colors.yellow);
            log('• Ensure critical CSS is inlined', colors.yellow);
        } else {
            log('• Great performance! Keep monitoring regularly', colors.green);
            log('• Consider A/B testing further optimizations', colors.green);
        }

        log('\n' + '='.repeat(50), colors.cyan);
        log(`Full report: ${response.lighthouseResult.finalUrl}`, colors.blue);
        log('='.repeat(50) + '\n', colors.cyan);

    } catch (error) {
        log(`\n❌ Error running Lighthouse: ${error.message}`, colors.red);
        log('\nTip: Make sure your site is accessible and try again.', colors.yellow);
    }
}

async function checkLocalServer() {
    return new Promise((resolve) => {
        const isHttps = TARGET_URL.startsWith('https');
        const client = isHttps ? https : http;

        client.get(TARGET_URL, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => {
            resolve(false);
        });
    });
}

async function main() {
    log('\n🚀 DripDrop Performance Testing Suite', colors.cyan);
    log('='.repeat(50) + '\n', colors.cyan);

    // Check if server is running
    if (TARGET_URL.includes('localhost')) {
        const isRunning = await checkLocalServer();
        if (!isRunning) {
            log('❌ Local server is not running!', colors.red);
            log('   Please start the server first:', colors.yellow);
            log('   npm run build && npm run start\n', colors.cyan);
            process.exit(1);
        }
        log('✓ Local server is running', colors.green);
    }

    await runLighthouse('mobile');
    await runLighthouse('desktop');
}

// Run the script
main().catch(console.error);
