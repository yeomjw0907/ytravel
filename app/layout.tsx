import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrgModalTrigger } from "@/components/layout/BrgModalTrigger";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--wt-font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ytravel | BRG를 위한 호텔 요금 비교",
  description:
    "Ytravel은 국내·해외 호텔 공식 홈페이지와 주요 예약 플랫폼의 요금을 비교해 BRG 가능성을 탐색하는 프리미엄 숙박 비교 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={displayFont.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BrgModalTrigger />
      </body>
    </html>
  );
}
