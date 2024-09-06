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
    <html suppressHydrationWarning dir="ltr" lang="en">
      <body className="font-sans antialiased ">
        <Providers>
          <Toaster position="bottom-center" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
