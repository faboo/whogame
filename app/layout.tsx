import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'The "Doctor Who" Game',
  description: "A reimplementation of an Atari classic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
