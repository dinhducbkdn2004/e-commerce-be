import { Resend } from 'resend'
import { render } from '@react-email/render'
import { VerificationEmail } from '../emails/templates/VerificationEmail'
import { PasswordResetEmail } from '../emails/templates/PasswordResetEmail'
import { config } from '../config'
import { logger } from '../utils/logger'
import * as React from 'react'

export class EmailService {
  private resend: Resend

  constructor() {
    if (!config.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is required')
    }
    
    this.resend = new Resend(config.RESEND_API_KEY)
  }

  async sendVerificationEmail(email: string, userName: string, verificationToken: string): Promise<void> {
    try {
      const verificationUrl = `${config.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`
      
      const emailHtml = await render(
        React.createElement(VerificationEmail, {
          userName,
          verificationUrl,
        })
      )

      const { data, error } = await this.resend.emails.send({
        from: 'BeeLuxe <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify your BeeLuxe account',
        html: emailHtml,
      })

      if (error) {
        logger.error('Failed to send verification email', {
          email,
          error: error.message,
        })
        throw new Error(`Failed to send verification email: ${error.message}`)
      }

      logger.info('Verification email sent successfully', {
        email,
        messageId: data?.id,
      })
    } catch (error) {
      logger.error('Error sending verification email', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  async sendPasswordResetEmail(email: string, userName: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${config.FRONTEND_URL}/auth/reset-password?token=${resetToken}`
      
      const emailHtml = await render(
        React.createElement(PasswordResetEmail, {
          userName,
          resetUrl,
        })
      )

      const { data, error } = await this.resend.emails.send({
        from: 'BeeLuxe <onboarding@resend.dev>',
        to: [email],
        subject: 'Reset your BeeLuxe password',
        html: emailHtml,
      })

      if (error) {
        logger.error('Failed to send password reset email', {
          email,
          error: error.message,
        })
        throw new Error(`Failed to send password reset email: ${error.message}`)
      }

      logger.info('Password reset email sent successfully', {
        email,
        messageId: data?.id,
      })
    } catch (error) {
      logger.error('Error sending password reset email', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'BeeLuxe <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to BeeLuxe - Your luxury shopping experience begins!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333ea;">Welcome to BeeLuxe, ${userName}!</h1>
            <p>Your email has been verified successfully. You can now enjoy our luxury collection.</p>
            <p>Thank you for joining BeeLuxe!</p>
            <p>Best regards,<br>The BeeLuxe Team</p>
          </div>
        `,
      })

      if (error) {
        logger.error('Failed to send welcome email', {
          email,
          error: error.message,
        })
        throw new Error(`Failed to send welcome email: ${error.message}`)
      }

      logger.info('Welcome email sent successfully', {
        email,
        messageId: data?.id,
      })
    } catch (error) {
      logger.error('Error sending welcome email', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()