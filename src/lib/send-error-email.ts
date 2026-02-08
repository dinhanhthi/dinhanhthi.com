import { Resend } from 'resend'

import { errorNotificationsConfig } from './config'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface ErrorEmailOptions {
  errorType: 'notion-api' | 'unofficial-notion' | 'redis' | 'cache-fetch' | 'other'
  errorMessage: string
  context?: string
  stack?: string
  metadata?: Record<string, unknown>
  whoIsCalling?: string
  uri?: string
}

/**
 * Send error notification email to admin
 *
 * Features:
 * - Silent failure (won't impact user experience)
 * - Global rate limiting (max X emails per time window, regardless of type)
 * - Per-type rate limiting (max 1 email per error type per time window)
 * - Graceful degradation if Resend not configured
 */
export async function sendErrorEmail({
  errorType,
  errorMessage,
  context,
  whoIsCalling,
  stack,
  metadata,
  uri
}: ErrorEmailOptions) {
  // Check if error emails are completely disabled
  if (process.env.DISABLE_ERROR_EMAILS === 'true') {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '⚠️ Error email notifications are completely disabled (DISABLE_ERROR_EMAILS=true)'
      )
    }
    return
  }

  // Skip if Resend not configured
  if (!resend) {
    console.log('⚠️ Resend not configured - skipping error email notification')
    return
  }

  const now = Date.now()

  // Global rate limiting: Check total emails sent within time window
  // Remove expired timestamps first
  while (
    globalEmailTimestamps.length > 0 &&
    now - globalEmailTimestamps[0] > errorNotificationsConfig.globalRateLimitMs
  ) {
    globalEmailTimestamps.shift()
  }

  if (globalEmailTimestamps.length >= errorNotificationsConfig.globalMaxEmails) {
    console.log(
      `⏰ Global rate limit: Skipping email (${globalEmailTimestamps.length}/${errorNotificationsConfig.globalMaxEmails} emails sent in last ${Math.floor(errorNotificationsConfig.globalRateLimitMs / 60000)}min)`
    )
    return
  }

  // Per-type rate limiting: Check if we recently sent an email for this error type
  const rateLimitKey = `email-sent-${errorType}`
  const lastSent = errorEmailCache.get(rateLimitKey)

  if (lastSent && now - lastSent < errorNotificationsConfig.rateLimitMs) {
    console.log(
      `⏰ Rate limit: Skipping email for ${errorType} (sent ${Math.floor((now - lastSent) / 1000)}s ago)`
    )
    return
  }

  try {
    const emailData = await resend.emails.send({
      from: 'onboarding@resend.dev', // Change to your verified domain later
      to: errorNotificationsConfig.adminEmail,
      subject: `🚨 [${process.env.NEXT_PUBLIC_SITE_DOMAIN} - ${process.env.ENV_MODE}] Error Alert: ${errorType}`,
      html: buildErrorEmailHTML({
        errorType,
        errorMessage,
        context,
        whoIsCalling,
        uri,
        stack,
        metadata,
        timestamp: new Date().toISOString()
      })
    })

    // Update rate limit caches
    errorEmailCache.set(rateLimitKey, now)
    globalEmailTimestamps.push(now)

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
  whoIsCalling,
  uri,
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

  const uriLink = uri
    ? ` (<a href="${uri}" target="_blank" style="color: #3182ce; text-decoration: underline;">${uri}</a>)`
    : ''

  const whoIsCallingHTML = whoIsCalling
    ? `<p><strong>Who is calling:</strong> ${whoIsCalling}${uriLink}</p>`
    : ''

  const uriHTML = !whoIsCalling && uri ? `<p><strong>URI:</strong> ${uri}</p>` : ''

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

      <p><strong>Site:</strong> ${process.env.NEXT_PUBLIC_SITE_DOMAIN} - ${process.env.ENV_MODE}</p>
      <p><strong>Type:</strong> <span class="error-type">${errorType}</span></p>
      <p><strong>Time:</strong> <span class="timestamp">${timestamp}</span></p>

      <p><strong>Logs:</strong> <a href="https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Faws$252Famplify$252Fd3ou8owhlk6mom" target="_blank">AWS CloudWatch Logs</a></p>

      <h3>❌ Error Message</h3>
      <pre style="background: #fff5f5; padding: 12px; border-left: 4px solid #e53e3e; border-radius: 4px;">${errorMessage}</pre>

      ${whoIsCallingHTML}
      ${uriHTML}
      ${contextHTML}
      ${metadataHTML}
      ${stackHTML}

      <hr style="margin-top: 32px; border: none; border-top: 1px solid #e2e8f0;">
      <p style="color: #718096; font-size: 12px;">
        This is an automated error notification from ${process.env.NEXT_PUBLIC_SITE_DOMAIN} - ${process.env.ENV_MODE}.
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
 * Global rate limit: Track timestamps of ALL emails sent (regardless of type)
 * Used to enforce maximum emails within a time window
 */
const globalEmailTimestamps: number[] = []

/**
 * Clean up old cache entries periodically (every hour)
 */
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now()

      // Clean per-type cache
      for (const [key, timestamp] of errorEmailCache.entries()) {
        if (now - timestamp > errorNotificationsConfig.rateLimitMs) {
          errorEmailCache.delete(key)
        }
      }

      // Clean global timestamps
      while (
        globalEmailTimestamps.length > 0 &&
        now - globalEmailTimestamps[0] > errorNotificationsConfig.globalRateLimitMs
      ) {
        globalEmailTimestamps.shift()
      }
    },
    60 * 60 * 1000
  ) // Run every hour
}
