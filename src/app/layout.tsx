import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Карточки слов",
  description: "Приложение для изучения английских слов",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
