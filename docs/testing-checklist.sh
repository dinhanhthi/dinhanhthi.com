#!/bin/bash

# ==============================================================================
# AWS Amplify Deployment Testing Checklist Script
# ==============================================================================
#
# Script này tự động test các tính năng quan trọng sau khi deploy lên AWS Amplify
# Usage: ./testing-checklist.sh https://your-amplify-domain.com
#
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED++))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Check if domain provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Domain not provided${NC}"
    echo "Usage: $0 <domain>"
    echo "Example: $0 https://main.d1234567890.amplifyapp.com"
    exit 1
fi

DOMAIN=$1
DEPLOY_HOOK_SECRET=${DEPLOY_HOOK_SECRET:-""}

# Remove trailing slash
DOMAIN=${DOMAIN%/}

print_header "AWS Amplify Deployment Testing"
echo "Testing domain: $DOMAIN"
echo "Started at: $(date)"
echo ""

# ==============================================================================
# 1. STATIC PAGES TESTING
# ==============================================================================

print_header "1. Static Pages Testing"

# Test home page
print_info "Testing home page..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/" | grep -q "200"; then
    print_success "Home page (/) loads successfully"
else
    print_error "Home page (/) failed to load"
fi

# Test about page
print_info "Testing about page..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/about/" | grep -q "200"; then
    print_success "About page (/about/) loads successfully"
else
    print_error "About page (/about/) failed to load"
fi

# Test notes listing
print_info "Testing notes listing..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/notes/" | grep -q "200"; then
    print_success "Notes listing (/notes/) loads successfully"
else
    print_error "Notes listing (/notes/) failed to load"
fi

# Test blogs listing
print_info "Testing blogs listing..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/blogs/" | grep -q "200"; then
    print_success "Blogs listing (/blogs/) loads successfully"
else
    print_error "Blogs listing (/blogs/) failed to load"
fi

# Test tags page
print_info "Testing tags page..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/tags/" | grep -q "200"; then
    print_success "Tags page (/tags/) loads successfully"
else
    print_error "Tags page (/tags/) failed to load"
fi

# Test tools page
print_info "Testing tools page..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/tools/" | grep -q "200"; then
    print_success "Tools page (/tools/) loads successfully"
else
    print_error "Tools page (/tools/) failed to load"
fi

# Test reading page
print_info "Testing reading page..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/reading/" | grep -q "200"; then
    print_success "Reading page (/reading/) loads successfully"
else
    print_error "Reading page (/reading/) failed to load"
fi

# ==============================================================================
# 2. DYNAMIC PAGES TESTING
# ==============================================================================

print_header "2. Dynamic Pages Testing"

# Get a random note slug from home page
print_info "Fetching a sample note slug..."
SAMPLE_NOTE_SLUG=$(curl -s "$DOMAIN/" | grep -o 'href="/note/[^"]*' | head -1 | sed 's/href="\/note\///')

if [ -n "$SAMPLE_NOTE_SLUG" ]; then
    print_info "Testing note detail page with slug: $SAMPLE_NOTE_SLUG"
    if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/note/$SAMPLE_NOTE_SLUG" | grep -q "200"; then
        print_success "Note detail page loads successfully"
    else
        print_error "Note detail page failed to load"
    fi
else
    print_warning "Could not find a sample note slug to test"
fi

# Test tag pagination
print_info "Testing tag pagination (docker/1/)..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/tag/docker/1/" | grep -q "200"; then
    print_success "Tag pagination page loads successfully"
else
    print_warning "Tag pagination page may not exist (this is OK if tag doesn't exist)"
fi

# Test blog pagination
print_info "Testing blog pagination (/blogs/1/)..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/blogs/1/" | grep -q "200"; then
    print_success "Blog pagination page loads successfully"
else
    print_error "Blog pagination page failed to load"
fi

# ==============================================================================
# 3. API ROUTES TESTING
# ==============================================================================

print_header "3. API Routes Testing"

# Test search-notion API
print_info "Testing /api/search-notion endpoint..."
SEARCH_RESPONSE=$(curl -s -X POST "$DOMAIN/api/search-notion" \
    -H "Content-Type: application/json" \
    -d '{"query": "docker"}' \
    -w "\n%{http_code}")

HTTP_CODE=$(echo "$SEARCH_RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "200" ]; then
    print_success "Search API endpoint works correctly"
else
    print_error "Search API endpoint returned HTTP $HTTP_CODE"
fi

# Test OG image generation
print_info "Testing /api/og endpoint..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/api/og?title=Test&description=Hello" | grep -q "200"; then
    print_success "OG image generation API works correctly"
else
    print_error "OG image generation API failed"
fi

# Test cache warming API (requires DEPLOY_HOOK_SECRET)
if [ -n "$DEPLOY_HOOK_SECRET" ]; then
    print_info "Testing /api/cron/warm-cache endpoint..."
    CACHE_RESPONSE=$(curl -s -X POST "$DOMAIN/api/cron/warm-cache" \
        -H "Authorization: Bearer $DEPLOY_HOOK_SECRET" \
        -w "\n%{http_code}")

    HTTP_CODE=$(echo "$CACHE_RESPONSE" | tail -1)
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Cache warming API works correctly"
    else
        print_error "Cache warming API returned HTTP $HTTP_CODE"
    fi
else
    print_warning "Skipping cache warming test (DEPLOY_HOOK_SECRET not set)"
    print_info "Set environment variable: export DEPLOY_HOOK_SECRET='your-secret'"
fi

# ==============================================================================
# 4. ISR (Incremental Static Regeneration) TESTING
# ==============================================================================

print_header "4. ISR Testing"

if [ -n "$SAMPLE_NOTE_SLUG" ]; then
    print_info "Testing ISR revalidation for: $SAMPLE_NOTE_SLUG"

    # First request
    FIRST_RESPONSE=$(curl -s -I "$DOMAIN/note/$SAMPLE_NOTE_SLUG")
    FIRST_AGE=$(echo "$FIRST_RESPONSE" | grep -i "age:" | awk '{print $2}' | tr -d '\r')

    if echo "$FIRST_RESPONSE" | grep -q "x-nextjs-cache\|age:"; then
        print_success "ISR headers detected (Age: ${FIRST_AGE:-N/A})"

        print_info "Waiting 5 seconds before second request..."
        sleep 5

        # Second request
        SECOND_RESPONSE=$(curl -s -I "$DOMAIN/note/$SAMPLE_NOTE_SLUG")
        SECOND_AGE=$(echo "$SECOND_RESPONSE" | grep -i "age:" | awk '{print $2}' | tr -d '\r')

        if [ "$SECOND_AGE" -gt "$FIRST_AGE" ] 2>/dev/null; then
            print_success "ISR working - Age header increased (${FIRST_AGE} → ${SECOND_AGE})"
        else
            print_warning "Age header did not increase as expected"
        fi
    else
        print_warning "ISR headers not found - may need to check CloudFront configuration"
    fi
else
    print_warning "Skipping ISR test (no sample note slug)"
fi

# ==============================================================================
# 5. IMAGE OPTIMIZATION TESTING
# ==============================================================================

print_header "5. Image Optimization Testing"

# Test Next.js image optimization
print_info "Testing Next.js image optimization..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/_next/image?url=/avatar.webp&w=128&q=75" | grep -q "200"; then
    print_success "Next.js image optimization works correctly"
else
    print_warning "Next.js image optimization may not be configured"
fi

# Test static images
print_info "Testing static image serving..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/avatar.webp" | grep -q "200"; then
    print_success "Static images serve correctly"
else
    print_error "Static images failed to load"
fi

# ==============================================================================
# 6. CACHE HEADERS TESTING
# ==============================================================================

print_header "6. Cache Headers Testing"

# Test static asset caching
print_info "Checking cache headers for static assets..."
STATIC_HEADERS=$(curl -s -I "$DOMAIN/_next/static/css/app/layout.css" 2>/dev/null || echo "")
if echo "$STATIC_HEADERS" | grep -qi "cache-control.*immutable"; then
    print_success "Static assets have correct cache headers (immutable)"
else
    print_warning "Static assets may not have optimal cache headers"
fi

# Test HTML caching
print_info "Checking cache headers for HTML pages..."
HTML_HEADERS=$(curl -s -I "$DOMAIN/")
if echo "$HTML_HEADERS" | grep -qi "cache-control"; then
    print_success "HTML pages have cache-control headers"
else
    print_warning "HTML pages may be missing cache headers"
fi

# ==============================================================================
# 7. SITEMAP & ROBOTS.TXT TESTING
# ==============================================================================

print_header "7. SEO Files Testing"

# Test sitemap
print_info "Testing sitemap.xml..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/sitemap.xml" | grep -q "200"; then
    print_success "Sitemap.xml is accessible"

    # Count URLs in sitemap
    URL_COUNT=$(curl -s "$DOMAIN/sitemap.xml" | grep -o "<url>" | wc -l)
    print_info "Sitemap contains approximately $URL_COUNT URLs"
else
    print_error "Sitemap.xml is not accessible"
fi

# Test robots.txt
print_info "Testing robots.txt..."
if curl -s -f -o /dev/null -w "%{http_code}" "$DOMAIN/robots.txt" | grep -q "200"; then
    print_success "Robots.txt is accessible"
else
    print_error "Robots.txt is not accessible"
fi

# ==============================================================================
# 8. PERFORMANCE TESTING
# ==============================================================================

print_header "8. Performance Testing"

# Measure response time
print_info "Measuring response times..."
HOME_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$DOMAIN/")
print_info "Home page response time: ${HOME_TIME}s"

if (( $(echo "$HOME_TIME < 2.0" | bc -l) )); then
    print_success "Home page loads in under 2 seconds"
elif (( $(echo "$HOME_TIME < 5.0" | bc -l) )); then
    print_warning "Home page loads in ${HOME_TIME}s (acceptable but could be faster)"
else
    print_error "Home page is slow (${HOME_TIME}s)"
fi

# ==============================================================================
# 9. SECURITY HEADERS TESTING
# ==============================================================================

print_header "9. Security Headers Testing"

SECURITY_HEADERS=$(curl -s -I "$DOMAIN/")

# Check X-Frame-Options
if echo "$SECURITY_HEADERS" | grep -qi "x-frame-options"; then
    print_success "X-Frame-Options header present"
else
    print_warning "X-Frame-Options header missing"
fi

# Check Content-Security-Policy
if echo "$SECURITY_HEADERS" | grep -qi "content-security-policy"; then
    print_success "Content-Security-Policy header present"
else
    print_warning "Content-Security-Policy header could be added for better security"
fi

# Check Strict-Transport-Security
if echo "$SECURITY_HEADERS" | grep -qi "strict-transport-security"; then
    print_success "HSTS header present"
else
    print_warning "HSTS header missing (may be added at CDN level)"
fi

# ==============================================================================
# 10. SSL/TLS TESTING
# ==============================================================================

print_header "10. SSL/TLS Testing"

# Extract domain without protocol
DOMAIN_NAME=$(echo "$DOMAIN" | sed 's/https\?:\/\///')

print_info "Checking SSL certificate for $DOMAIN_NAME..."
if echo | openssl s_client -servername "$DOMAIN_NAME" -connect "$DOMAIN_NAME:443" 2>/dev/null | grep -q "Verify return code: 0"; then
    print_success "SSL certificate is valid"
else
    print_warning "SSL certificate verification may have issues"
fi

# ==============================================================================
# SUMMARY
# ==============================================================================

print_header "Test Summary"

echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$(echo "scale=2; $PASSED * 100 / $TOTAL" | bc)

if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical tests passed! Deployment looks good.${NC}"
    EXIT_CODE=0
elif [ "$FAILED" -le 2 ]; then
    echo -e "${YELLOW}⚠️  Some tests failed, but deployment may still be functional.${NC}"
    echo -e "${YELLOW}Review failed tests and fix if necessary.${NC}"
    EXIT_CODE=1
else
    echo -e "${RED}❌ Multiple tests failed. Please review and fix issues.${NC}"
    EXIT_CODE=1
fi

echo ""
echo "Success rate: ${SUCCESS_RATE}%"
echo "Completed at: $(date)"

# ==============================================================================
# NEXT STEPS
# ==============================================================================

if [ "$FAILED" -gt 0 ]; then
    print_header "Troubleshooting Tips"
    echo "1. Check AWS Amplify build logs for errors"
    echo "2. Verify environment variables are set correctly"
    echo "3. Check CloudWatch logs for runtime errors"
    echo "4. Test Redis connection (Upstash dashboard)"
    echo "5. Verify Notion API credentials"
    echo ""
    echo "Run with debug: curl -v $DOMAIN/api/search-notion"
fi

exit $EXIT_CODE
