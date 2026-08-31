import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://avero.academy";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AVERO ACADEMY - Nursing Council Exam Prep & Question Bank",
    template: "%s | AVERO ACADEMY",
  },
  description:
    "AVERO ACADEMY turns scattered professional examination past questions into an organized, subject-based, explanation-driven study system for nursing council exams.",
  keywords: [
    "Avero",
    "Avero Academy",
    "Nursing Council Exam Prep",
    "NMCN Past Questions",
    "Nursing Past Questions",
    "Nursing Study System",
    "Nursing Exam Preparation",
    "Avero Nursing",
  ],
  authors: [{ name: "AVERO ACADEMY" }],
  creator: "AVERO ACADEMY",
  publisher: "AVERO ACADEMY",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "AVERO ACADEMY - Nursing Council Exam Prep & Question Bank",
    description:
      "AVERO ACADEMY turns scattered professional examination past questions into an organized, subject-based, explanation-driven study system.",
    url: siteUrl,
    siteName: "AVERO ACADEMY",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/favicon.png",
        width: 512,
        height: 512,
        alt: "AVERO ACADEMY Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AVERO ACADEMY - Nursing Council Exam Prep",
    description:
      "Organized, subject-based, explanation-driven study system for nursing council exams.",
    images: ["/images/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AVERO ACADEMY",
    alternateName: ["Avero", "Avero Nursing Academy"],
    url: siteUrl,
    logo: `${siteUrl}/images/favicon.png`,
    description:
      "Subject-based, explanation-driven study system for nursing council examination prep.",
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AVERO ACADEMY",
    alternateName: "Avero",
    url: siteUrl,
  };

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f5f8ff] bg-dot-pattern text-[#0f172a] font-[family-name:var(--font-montserrat)]">
        {children}
      </body>
    </html>
  );
}
