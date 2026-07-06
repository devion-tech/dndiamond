import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "react-hot-toast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      className={`${plusJakarta.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
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
