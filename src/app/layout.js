import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Terminal Prime — Executive Financial Dashboard",
  description: "Bloomberg Terminal-inspired enterprise financial dashboard with real-time KPI analytics, revenue tracking, OPEX variance monitoring, and granular audit trail capabilities.",
  keywords: "financial dashboard, bloomberg terminal, KPI analytics, revenue tracking, OPEX, audit trail",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
