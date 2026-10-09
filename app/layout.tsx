import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScamShield AI — Pre-Click Threat Analyzer | IEEE VIT Bhopal Hackathon 2026",
  description: "Real-Time Phishing Link & QR Code Threat Analyzer with NLP-Powered Message Intelligence. Track 04.1 Cybersecurity by Team D43M0N$.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
