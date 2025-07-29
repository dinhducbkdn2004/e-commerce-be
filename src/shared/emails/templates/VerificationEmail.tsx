import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VerificationEmailProps {
  userName: string
  verificationUrl: string
}

export const VerificationEmail = ({
  userName = 'User',
  verificationUrl = 'https://example.com/verify',
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your BeeLuxe account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <div style={logo}>
            <div style={logoIcon}></div>
            <span style={logoText}>
              Bee<span style={logoAccent}>Luxe</span>
            </span>
          </div>
        </Section>

        <Section style={section}>
          <Heading style={h1}>Welcome to BeeLuxe!</Heading>
          
          <Text style={text}>
            Hi {userName},
          </Text>
          
          <Text style={text}>
            Thank you for creating an account with BeeLuxe. To complete your registration and start shopping our luxury collection, please verify your email address.
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          
          <Text style={linkText}>
            {verificationUrl}
          </Text>

          <Text style={text}>
            This verification link will expire in 24 hours for security reasons.
          </Text>

          <Text style={text}>
            If you didn't create this account, you can safely ignore this email.
          </Text>

          <Text style={footer}>
            Best regards,<br />
            The BeeLuxe Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default VerificationEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoSection = {
  padding: '32px 0',
  textAlign: 'center' as const,
}

const logo = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}

const logoIcon = {
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)',
  transform: 'rotate(45deg)',
  borderRadius: '4px',
}

const logoText = {
  fontSize: '24px',
  fontWeight: '300',
  letterSpacing: '2px',
  color: '#1f2937',
}

const logoAccent = {
  fontWeight: '600',
  background: 'linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

const section = {
  padding: '0 48px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
  marginBottom: '32px',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
}

const buttonSection = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
}

const button = {
  backgroundColor: '#9333ea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  margin: '0 auto',
}

const linkText = {
  color: '#9333ea',
  fontSize: '14px',
  textDecoration: 'underline',
  marginBottom: '16px',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
} 