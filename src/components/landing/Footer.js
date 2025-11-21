"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-card-bg/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Kluster Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-soft-cyan to-soft-violet bg-clip-text text-transparent">
                KLUSTER
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your ultimate campus collaboration platform. Connect with peers,
              share knowledge, and build your academic community.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/kluster"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/kluster"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/kluster"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@kluster"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/kluster"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/20 hover:bg-soft-cyan/10 text-muted-foreground hover:text-soft-cyan transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Sign Up
              </Link>
              <Link
                href="/qa"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Q&A Forum
              </Link>
              <Link
                href="/cluster"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Cluster
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Leaderboard
              </Link>
              <Link
                href="/events"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Events
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Resources
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/library"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Library
              </Link>
              <Link
                href="/notifications"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Notifications
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Cookie Policy
              </Link>
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                Forgot Password
              </Link>
            </nav>
          </div>

          {/* Get in Touch & Stay Updated */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="flex flex-col space-y-3">
              <a
                href="mailto:official@kluster.in"
                className="flex items-start gap-2 text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>official@kluster.in</span>
              </a>
              <a
                href="tel:+919640942444"
                className="flex items-start gap-2 text-sm text-muted-foreground hover:text-soft-cyan transition-colors duration-200"
              >
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 96409 42444</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Building connections across campuses worldwide</span>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Stay Updated
              </h4>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-muted/20 border-cyber-border text-sm"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 text-white font-semibold px-6"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border-subtle/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Kluster. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-center text-sm text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-soft-cyan transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-border-subtle">•</span>
            <Link
              href="/cookies"
              className="hover:text-soft-cyan transition-colors duration-200"
            >
              Cookie Policy
            </Link>
            <span className="text-border-subtle">•</span>
            <Link
              href="/terms"
              className="hover:text-soft-cyan transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
            <span className="text-border-subtle">•</span>
            <a
              href="mailto:official@kluster.in"
              className="hover:text-soft-cyan transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>

          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with{" "}
            <Heart className="w-4 h-4 text-neon-purple fill-current" /> for
            students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
