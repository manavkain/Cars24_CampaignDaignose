import './globals.css'

export const metadata = {
  title: 'AI Growth Operator',
  description: 'Post-launch campaign intelligence. Diagnose. Fix. Track.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
