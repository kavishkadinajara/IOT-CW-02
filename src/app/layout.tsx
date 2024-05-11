import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../Style/globals.css";
import '../Style/scrollbar.css'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0c1106] via-[#000600] to-[#000000]'}>
        {children}
        </body>
    </html>
  );
}
