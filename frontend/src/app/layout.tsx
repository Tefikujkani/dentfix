import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { PressEffects } from "@/components/PressEffects";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dentfix | Strong Teeth, Bright Smile",
  description:
    "Family dentistry on Harbor Lane — checkups, whitening, implants, aligners, and same-day emergencies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-ink antialiased">
        <PressEffects />
        {children}
      </body>
    </html>
  );
}
