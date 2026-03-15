import React from 'react';
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto min-h-screen max-w-4xl p-6">{children}</main>
      </body>
    </html>
  );
}
