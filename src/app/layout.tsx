import type { Metadata } from 'next';
import { Oswald, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import { SessaoProvider } from '@/contexts/SessaoContext';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-stencil',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Registro de Sacos Perdidos',
  description: 'Controle de sacos perdidos e encontrados no armazém',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body min-h-screen">
        <SessaoProvider>
          <NavBar />
          <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">
            {children}
          </main>
        </SessaoProvider>
      </body>
    </html>
  );
}