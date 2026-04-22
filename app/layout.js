import './globals.css'
export const metadata = { 
  title: 'Cars24 — AI Campaign Diagnosis', 
  description: 'Precision Architect — AI-powered campaign diagnostic intelligence',
  icons: {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEVHNv7///9JOP79/f9GNf5KOv48Kv4+LP78+/84Jv5EM/6jm/9BMP5PPv5RQf5ALv7u7f/08//r6f/k4f96bf7a1v+4sf+vqP9WR/5eT/5zZv7Auv/Hwv+ooP9wY//QzP/29v+flv/e2/9+cv9qW/+Eef+ro/9cTP6Og//U0f9sXv6Ge/+Tif+Xjv+6tP/c2f+xJRxjAAACIklEQVRYhe1W2ZKqMBBNmiwSQBYXwBV1Vr0z8/9/dyOEKHcSiUzV1H3wvFha9unT6RWhBx74zwEUiJAgiNIh1iT2Q4jG44gKnwmAO+1DRhe75SxL02S/Wh/GnN9DQQUrgwm+QjLfxLFzIMCKvJJWnufV1qPzh7d6YsRRBH9OlNUF8tsoIKELgwhfsDe6QMk4M24LhzAI3eKu83MsSsWk5L0axDjoIt+mGGuG1/4oiN8FE8XbXjPMqOgNgnYBSDC0q9q3nPcHYaBE/iJpGQ5sAAOi/jHVQZABBJLhuZXwdkOCaGByQdm8fkkPv9sVkKiBqVogLFOl4RibJUC8SWpUS1OqQEoY1RICZq5H6u+UyBdTlMCn6hG2tlIIl7ULjKfGXIsoa2LIIjMDgVlTcFVh+cPTosbRIkB7mNjKNeQ1YhvBOFWlArZEQYPhBLfRH0IPCHzdfsSeCHrTiETzhiy02F8KaW0sNVFMaxxKm0C+UDNwb+pY0N208y2jVUTtMjl9l3DVTBtLM0kfazX79t+L9aqdrTmSTirVL/m/EtwGCrC8keDhP34nXa4jTbxm7TL5YIK2FO5DlbKT3gCfhUw43DvWgeeaIQtKwpvF8qV/fO8rcyJWqhzP+3g2X9+92gSs1DL19I5t7wSn5QpC5FiJkJaX9e45rncEiJ+ya/86IMcD48aJg1y34k+PLGQ885zdKwYqayAefmg2HD85dR944HfxF5h5IaGc9BBOAAAAAElFTkSuQmCC',
  },
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEVHNv7///9JOP79/f9GNf5KOv48Kv4+LP78+/84Jv5EM/6jm/9BMP5PPv5RQf5ALv7u7f/08//r6f/k4f96bf7a1v+4sf+vqP9WR/5eT/5zZv7Auv/Hwv+ooP9wY//QzP/29v+flv/e2/9+cv9qW/+Eef+ro/9cTP6Og//U0f9sXv6Ge/+Tif+Xjv+6tP/c2f+xJRxjAAACIklEQVRYhe1W2ZKqMBBNmiwSQBYXwBV1Vr0z8/9/dyOEKHcSiUzV1H3wvFha9unT6RWhBx74zwEUiJAgiNIh1iT2Q4jG44gKnwmAO+1DRhe75SxL02S/Wh/GnN9DQQUrgwm+QjLfxLFzIMCKvJJWnufV1qPzh7d6YsRRBH9OlNUF8tsoIKELgwhfsDe6QMk4M24LhzAI3eKu83MsSsWk5L0axDjoIt+mGGuG1/4oiN8FE8XbXjPMqOgNgnYBSDC0q9q3nPcHYaBE/iJpGQ5sAAOi/jHVQZABBJLhuZXwdkOCaGByQdm8fkkPv9sVkKiBqVogLFOl4RibJUC8SWpUS1OqQEoY1RICZq5H6u+UyBdTlMCn6hG2tlIIl7ULjKfGXIsoa2LIIjMDgVlTcFVh+cPTosbRIkB7mNjKNeQ1YhvBOFWlArZEQYPhBLfRH0IPCHzdfsSeCHrTiETzhiy02F8KaW0sNVFMaxxKm0C+UDNwb+pY0N208y2jVUTtMjl9l3DVTBtLM0kfazX79t+L9aqdrTmSTirVL/m/EtwGCrC8keDhP34nXa4jTbxm7TL5YIK2FO5DlbKT3gCfhUw43DvWgeeaIQtKwpvF8qV/fO8rcyJWqhzP+3g2X9+92gSs1DL19I5t7wSn5QpC5FiJkJaX9e45rncEiJ+ya/86IMcD48aJg1y34k+PLGQ885zdKwYqayAefmg2HD85dR944HfxF5h5IaGc9BBOAAAAAElFTkSuQmCC" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
