import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "lru.me",
  description: "Next Generation Superpower Short Links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <Toaster position="bottom-center" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
