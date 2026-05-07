import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./theme-provider";
import ClientRoot from "./ClientRoot";

const shareTechMono = Share_Tech_Mono({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Live UI Components – Design with HTML & CSS",
  description:
    "Create, customize, and preview HTML & CSS components live in the browser. Perfect for designers, developers, and UI enthusiasts.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${shareTechMono.className} relative bg-black`}>
        <ThemeProvider>
          <ClientRoot>{children}</ClientRoot> {/* handles loading state */}
        </ThemeProvider>
      </body>
    </html>
  );
}
