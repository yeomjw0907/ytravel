import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrgModalTrigger } from "@/components/layout/BrgModalTrigger";
import { AnalyticsListener } from "@/components/analytics/AnalyticsListener";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--wt-font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ytravel | 예약가 점검과 호텔 후보 탐색",
  description:
    "Ytravel은 예약한 호텔 가격을 다시 점검하고, 지원 사이트 기준으로 더 저렴한 후보와 조건 차이를 빠르게 확인하도록 돕는 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={displayFont.variable}>
      <body className="flex min-h-screen flex-col">
        <AnalyticsListener />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BrgModalTrigger />
      </body>
    </html>
  );
}
