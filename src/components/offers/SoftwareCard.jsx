"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2 } from "lucide-react";

/**
 * SoftwareCard Component
 * 
 * Displays a software benefit card with logo, eligibility, benefits, and link.
 * Used in the Student Software Hub to showcase free tools and perks.
 * 
 * @param {Object} software - The software benefit data
 * @param {string} software.id - Unique identifier for the software
 * @param {string} software.name - Name of the software/tool
 * @param {string} software.logo - URL or path to logo image
 * @param {string} software.eligibility - Eligibility criteria description
 * @param {string|string[]} software.benefits - Benefits description (string or array)
 * @param {string} software.link - Official website link
 * @param {string} software.category - Category for filtering (optional)
 */
export function SoftwareCard({ software }) {
  const handleLearnMore = () => {
    window.open(software.link, "_blank", "noopener,noreferrer");
  };

  // Convert benefits to array if it's a string
  const benefitsList = Array.isArray(software.benefits)
    ? software.benefits
    : [software.benefits];

  return (
    <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl hover:shadow-lg hover:shadow-neon-cyan/10 transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 rounded-lg bg-cyber-darker/50 border border-cyber-border flex items-center justify-center p-2 overflow-hidden">
            {software.logo ? (
              <img
                src={software.logo}
                alt={`${software.name} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded flex items-center justify-center">
                <span className="text-xl font-bold text-neon-cyan">
                  {software.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          {software.category && (
            <Badge variant="secondary" className="bg-cyber-darker/70 text-xs">
              {software.category}
            </Badge>
          )}
        </div>

        {/* Software Name */}
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
          {software.name}
        </h3>

        {/* Eligibility */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
            <span className="text-xs font-semibold text-neon-cyan uppercase tracking-wide">
              Eligibility
            </span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {software.eligibility}
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-neon-purple flex-shrink-0" />
            <span className="text-xs font-semibold text-neon-purple uppercase tracking-wide">
              Benefits
            </span>
          </div>
          <div className="pl-6 space-y-1">
            {benefitsList.map((benefit, idx) => (
              <p key={idx} className="text-sm text-muted-foreground">
                • {benefit}
              </p>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 border-t border-cyber-border">
        <div className="w-full space-y-3">
          {/* View Details Button */}
          <Link href={`/offers/${software.id}`}>
            <Button
              variant="outline"
              className="w-full bg-muted/50 hover:bg-muted border-cyber-border hover:border-neon-cyan/30 transition-all duration-300"
            >
              View Details
            </Button>
          </Link>

          {/* Learn More Button */}
          <Button
            onClick={handleLearnMore}
            className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all duration-300"
          >
            Learn More
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
