import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevPort Draw - The Ultimate Collaborative Drawing Tool',
  description: 'Transform your ideas into beautiful diagrams, wireframes, and illustrations. Create, collaborate, and bring your vision to life with DevPort Draw.',
  keywords: 'drawing tool, collaborative whiteboard, diagrams, wireframes, excalidraw alternative, online drawing',
  authors: [{ name: 'DevPort Team' }],
  openGraph: {
    title: 'DevPort Draw - Draw Ideas Into Reality',
    description: 'The ultimate collaborative drawing tool for creators, designers, and teams.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPort Draw - Draw Ideas Into Reality',
    description: 'The ultimate collaborative drawing tool for creators, designers, and teams.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}