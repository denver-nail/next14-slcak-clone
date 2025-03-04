import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Models } from "@/components/models";
import { Toaster } from "sonner";
import { JotaiProvider } from "@/components/jotai-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "欢迎来到slack",
  description: "更快捷强大的交流",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <NuqsAdapter>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ConvexClientProvider>
              <JotaiProvider>
                <Toaster />
                <Models />
                {children}
              </JotaiProvider>
            </ConvexClientProvider>
          </body>
        </html>
      </NuqsAdapter>
    </ConvexAuthNextjsServerProvider>
  );
}
