import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const adminEmail = process.env.ADMIN_EMAIL ?? ''

export interface ErrorEmailOptions {
  errorType: 'notion-api' | 'unofficial-notion' | 'redis' | 'cache-fetch' | 'other'
  errorMessage: string
  context?: string
  stack?: string
  metadata?: Record<string, unknown>
}

/**
 * Send error notification email to admin
 *
 * Features:
 * - Silent failure (won't impact user experience)
 * - Rate limiting (max 1 email per error type per 5 minutes)
 * - Environment-aware (only in production by default)
 * - Graceful degradation if Resend not configured
 */
export async function sendErrorEmail({
  errorType,
  errorMessage,
  context,
  stack,
  metadata
}: ErrorEmailOptions) {
  // Skip if Resend not configured
  if (!resend) {
    console.log('⚠️ Resend not configured - skipping error email notification')
    return
  }

  // Skip in development unless explicitly enabled
  const isDevelopment = process.env.ENV_MODE === 'dev'
  const enableInDev = process.env.SEND_ERROR_EMAILS_IN_DEV === 'true'

  if (isDevelopment && !enableInDev) {
    console.log('ℹ️ Skipping error email in development mode')
    return
  }

  // Rate limiting: Check if we recently sent an email for this error type
  const rateLimitKey = `email-sent-${errorType}`
  const lastSent = errorEmailCache.get(rateLimitKey)
  const now = Date.now()
  const rateLimitMs = 5 * 60 * 1000 // 5 minutes

  if (lastSent && now - lastSent < rateLimitMs) {
    console.log(
      `⏰ Rate limit: Skipping email for ${errorType} (sent ${Math.floor((now - lastSent) / 1000)}s ago)`
    )
    return
  }

  try {
    const emailData = await resend.emails.send({
      from: 'onboarding@resend.dev', // Change to your verified domain later
      to: adminEmail,
      subject: `🚨 [${process.env.NEXT_PUBLIC_SITE_DOMAIN}] Error Alert: ${errorType}`,
      html: buildErrorEmailHTML({
        errorType,
        errorMessage,
        context,
        stack,
        metadata,
        timestamp: new Date().toISOString()
      })
    })

    // Update rate limit cache
    errorEmailCache.set(rateLimitKey, now)

    console.log(`✅ Error email sent successfully (ID: ${emailData.data?.id || 'unknown'})`)
  } catch (emailError) {
    // Silent failure - don't throw error to avoid impacting user experience
    console.error('❌ Failed to send error email:', emailError)
  }
}

/**
 * Build HTML email content
 */
function buildErrorEmailHTML({
  errorType,
  errorMessage,
  context,
  stack,
  metadata,
  timestamp
}: ErrorEmailOptions & { timestamp: string }): string {
  const metadataHTML = metadata
    ? `
    <h3>📊 Metadata</h3>
    <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(metadata, null, 2)}</pre>
  `
    : ''

  const stackHTML = stack
    ? `
    <h3>📚 Stack Trace</h3>
    <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${stack}</pre>
  `
    : ''

  const contextHTML = context ? `<p><strong>Context:</strong> ${context}</p>` : ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h2 { color: #e53e3e; border-bottom: 2px solid #e53e3e; padding-bottom: 8px; }
        h3 { color: #2d3748; margin-top: 24px; }
        .error-type { display: inline-block; background: #fed7d7; color: #c53030; padding: 4px 12px; border-radius: 4px; font-weight: 600; }
        .timestamp { color: #718096; font-size: 14px; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
      </style>
    </head>
    <body>
      <h2>🚨 Error Alert</h2>

      <p><strong>Site:</strong> ${process.env.NEXT_PUBLIC_SITE_DOMAIN}</p>
      <p><strong>Type:</strong> <span class="error-type">${errorType}</span></p>
      <p><strong>Time:</strong> <span class="timestamp">${timestamp}</span></p>

      <h3>❌ Error Message</h3>
      <pre style="background: #fff5f5; padding: 12px; border-left: 4px solid #e53e3e; border-radius: 4px;">${errorMessage}</pre>

      ${contextHTML}
      ${metadataHTML}
      ${stackHTML}

      <hr style="margin-top: 32px; border: none; border-top: 1px solid #e2e8f0;">
      <p style="color: #718096; font-size: 12px;">
        This is an automated error notification from ${process.env.NEXT_PUBLIC_SITE_DOMAIN} deployed on Vercel.
      </p>
    </body>
    </html>
  `
}

/**
 * Simple in-memory cache for rate limiting
 * In production, consider using Redis if you have multiple instances
 */
const errorEmailCache = new Map<string, number>()

/**
 * Clean up old cache entries periodically (every hour)
 */
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now()
      const rateLimitMs = 5 * 60 * 1000

      for (const [key, timestamp] of errorEmailCache.entries()) {
        if (now - timestamp > rateLimitMs) {
          errorEmailCache.delete(key)
        }
      }
    },
    60 * 60 * 1000
  ) // Run every hour
}
