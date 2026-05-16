import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Museum of Communication — Signals Across Time",
  description: "A scroll-driven exhibit through four pivotal eras of human communication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
