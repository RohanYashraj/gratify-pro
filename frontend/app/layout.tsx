import type { Metadata } from 'next';
import Layout from '../components/Layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gratify Pro',
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
        <Layout>{children}</Layout>
      </body>
    </html>
  );
} 