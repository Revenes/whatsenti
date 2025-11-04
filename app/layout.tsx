import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whatsenti",
  description: "Chat with Sentient AI in a WhatsApp-like interface",
  icons: {
    icon: "/whatsenti.ico",
    shortcut: "/whatsenti.ico",
    apple: "/whatsenti.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/whatsenti.ico" type="image/ico" />
        <meta name="theme-color" content="#0b141a" />
      </head>
      <body>{children}</body>
    </html>
  );
}