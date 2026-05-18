import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "./globals.css";

export const metadata = {
  title: "DDX Fitness x Fitvend",
  description: "Catalog for DDX Fitness vending products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
