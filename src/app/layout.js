import { Cormorant_Garamond, Instrument_Sans, Instrument_Serif, Lexend, Manrope, Mulish, Playfair, Quicksand } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "react-hot-toast";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["normal", "italic"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "dn Diamonds | Certified Diamond & Fine Jewelry Atelier - Hong Kong",
  description:
    "Experience premium, handcrafted fine gold and GIA-certified diamond jewelry in Central, Hong Kong. Bespoke custom designs crafted to endure for generations.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${lexend.variable} ${manrope.variable} ${mulish.variable} ${playfair.variable} ${quicksand.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&family=Lexend:wght@100..900&family=Manrope:wght@200..800&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-slate-background text-primary font-sans flex flex-col">
        <ReduxProvider>
          <StoreProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#FFFFFF",
                  color: "#0F172A",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                },
              }}
            />
            {children}
          </StoreProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
