import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://kluster.in"),
  title: {
    default: "KLUSTER - Transform Your Campus Into a Connected Community",
    template: "%s | KLUSTER",
  },
  description:
    "Discover the ultimate campus communication solution. KLUSTER unifies social networking, Q&A forums, classroom tools, and real-time chat in one secure, domain-verified platform. Perfect for students, faculty, and campus communities.",
  keywords: [
    "campus communication platform",
    "secure student social network",
    "unified campus app",
    "all-in-one university platform",
    "student engagement platform",
    "WhatsApp alternative for campus",
    "Discord alternative for students",
    "college community app",
    "best campus app",
    "student networking",
    "academic collaboration",
    "university social platform",
  ],
  authors: [{ name: "KLUSTER" }],
  creator: "KLUSTER",
  publisher: "KLUSTER",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kluster.in/",
    siteName: "KLUSTER",
    title: "KLUSTER - Transform Your Campus Into a Connected Community",
    description:
      "Stop juggling 7+ apps for campus life! KLUSTER is the secure, domain-verified platform that unifies social networking, Q&A forums, classroom tools, events, and real-time chat. Join thousands of students who've eliminated app chaos. 🎓✨",
    images: [
      {
        url: "/assets/kluster-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "KLUSTER - Campus Communication Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KlusterApp",
    creator: "@KlusterApp",
    title: "KLUSTER - One Platform. One Campus. Infinite Connections.",
    description:
      "Campus life shouldn't require 7+ apps. KLUSTER unifies social feed, chat, Q&A, events & classroom tools in ONE secure network. Domain-verified. Student-focused. Revolution starts here. 🚀",
    images: ["/assets/kluster-twitter-card.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  applicationName: "KLUSTER",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KLUSTER",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#8B5CF6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "KLUSTER",
    url: "https://kluster.in",
    description:
      "A secure campus communication platform that unifies social networking, Q&A forums, classroom integration, and real-time collaboration for university communities.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "KLUSTER",
      url: "https://kluster.in",
    },
    featureList: [
      "Secure campus social networking",
      "Domain-verified access control",
      "Real-time chat and messaging",
      "Academic Q&A forums",
      "Classroom integration",
      "Campus event management",
      "Student profile directory",
      "Resource library sharing",
      "Leaderboard and gamification",
      "All-in-one campus platform",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KLUSTER",
    url: "https://kluster.in",
    logo: "https://kluster.in/assets/kluster-logo.png",
    description:
      "KLUSTER is a secure, all-in-one campus communication platform that eliminates app chaos by unifying social networking, academic collaboration, and student engagement tools.",
    foundingDate: "2024",
    sameAs: [
      "https://twitter.com/KlusterApp",
      "https://github.com/kluster0009-glitch",
      "https://linkedin.com/company/kluster",
      "https://instagram.com/klusterapp",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@kluster.in",
      availableLanguage: ["English"],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
