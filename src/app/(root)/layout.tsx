import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "潦草头像",
  description: "创建一个潦草头像",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
