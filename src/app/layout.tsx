import { SocketProvider } from "@/contexts/SocketContext";
import ReduxProvider from "@/redux/Provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const myFont = localFont({
//   src: "/public/font/fonnts.com-Degular_Variable.otf",
//   variable: "--font-degular-variable",
// });

export const metadata: Metadata = {
  title: "Peterson Dashboard",
  description: "Peterson Dashboard",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}   antialiased h-screen`}
      >
        <ReduxProvider>
          <SocketProvider>
            {children}
            <Toaster
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
            />
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
