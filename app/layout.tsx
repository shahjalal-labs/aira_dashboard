import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Aira Admin Dashboard",
  description: "Aira Admin Dashboard is a powerful and intuitive platform designed to help administrators manage and monitor their operations efficiently. With a user-friendly interface and robust features, Aira Admin Dashboard provides real-time insights, analytics, and tools to streamline workflows and enhance productivity. Whether you're overseeing a team, tracking performance metrics, or managing resources, Aira Admin Dashboard offers the tools you need to make informed decisions and drive success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
