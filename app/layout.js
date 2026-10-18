import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const font = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "ระบบจัดการสต็อกสินค้า",
  description: "ระบบจัดการสต็อกสินค้าร้านค้าภูมิใจ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${font.className} min-h-screen bg-emerald-50 text-slate-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}