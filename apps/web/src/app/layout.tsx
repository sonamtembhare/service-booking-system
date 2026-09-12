import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import ConditionalNavbar from "@/components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "Service Booking System",
  description: "Book your favourite services online. Professional haircuts, facials, massages, makeup and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
