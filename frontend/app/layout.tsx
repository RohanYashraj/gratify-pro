import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gratuity Pro',
  description: 'Calculate gratuity amounts according to the Payment of Gratuity Act, 1972',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
} 