import { formMetaTags } from "@/lib/utils";
import { Providers } from "@/providers/providers";
import { Inter } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = formMetaTags();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} dark text-foreground bg-background w-full min-h-screen`}
      >
        <main className="flex flex-col min-h-screen w-full">
          <Providers>{children}</Providers>
          <Toaster
            toastOptions={{
              unstyled: false,
              classNames: {
                toast:
                  "!bg-slate-500 border-2 !border-slate-900/40 !text-foreground",
                error:
                  "!bg-destructive !border-destructive/40 !text-foreground",
              },
            }}
          />
        </main>
      </body>
    </html>
  );
}
