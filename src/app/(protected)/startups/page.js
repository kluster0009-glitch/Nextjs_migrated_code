"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Building2 } from "lucide-react";

// Import custom components
import StartupsStats from "@/components/startups/StartupsStats";
import StartupsCarousel from "@/components/startups/StartupsCarousel";
import FiltersSidebar from "@/components/startups/FiltersSidebar";
import StartupCard from "@/components/startups/StartupCard";

export default function StartupsPage() {
  const { user } = useAuth();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskLevel, setRiskLevel] = useState("all");
  const [subscriptionType, setSubscriptionType] = useState("all");
  const [subscriptionFee, setSubscriptionFee] = useState("all");
  const [investmentAmount, setInvestmentAmount] = useState("any");
  const [rebalancingFrequency, setRebalancingFrequency] = useState("all");
  const [includeNew, setIncludeNew] = useState(true);
  const [sortBy, setSortBy] = useState("returns");
  const [likedStartups, setLikedStartups] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    risk: false,
    subscription: false,
    fee: false,
    investment: false,
    rebalancing: false,
    other: false,
  });
  const [carouselApi, setCarouselApi] = useState();

  // Mock data - replace with actual Supabase queries
  const mockStartups = [
    {
      id: 1,
      name: "TechVenture AI",
      tagline: "AI-powered solutions for modern businesses",
      description: "Building the future of enterprise automation with cutting-edge AI technology.",
      logo: null,
      industry: "Artificial Intelligence",
      risk: "High",
      subscriptionType: "Paid",
      subscriptionFeeAmount: 999,
      minInvestment: 10000,
      rebalancing: "Quarterly",
      stage: "Series A",
      funding: "$5M",
      fundingAmount: 5000000,
      location: "Bangalore, India",
      founded: "2022",
      teamSize: 25,
      growth: "+45%",
      cagr: 45,
      valuation: "$20M",
      followers: 1234,
      isNew: true,
      tags: ["AI/ML", "B2B", "SaaS"],
      featured: true,
    },
    {
      id: 2,
      name: "EduConnect",
      tagline: "Connecting students with opportunities",
      description: "Platform bridging the gap between students and industry through internships and projects.",
      logo: null,
      industry: "EdTech",
      risk: "Medium",
      subscriptionType: "Free access",
      subscriptionFeeAmount: 0,
      minInvestment: 5000,
      rebalancing: "Monthly",
      stage: "Seed",
      funding: "$1.2M",
      fundingAmount: 1200000,
      location: "Mumbai, India",
      founded: "2023",
      teamSize: 12,
      growth: "+120%",
      cagr: 120,
      valuation: "$5M",
      followers: 856,
      isNew: true,
      tags: ["Education", "Platform", "B2C"],
      featured: false,
    },
    {
      id: 3,
      name: "HealthFirst",
      tagline: "Digital healthcare for everyone",
      description: "Making quality healthcare accessible through telemedicine and AI diagnostics.",
      logo: null,
      industry: "HealthTech",
      risk: "Low",
      subscriptionType: "Fee-based",
      subscriptionFeeAmount: 1999,
      minInvestment: 50000,
      rebalancing: "Annual",
      stage: "Series B",
      funding: "$15M",
      fundingAmount: 15000000,
      location: "Delhi, India",
      founded: "2021",
      teamSize: 50,
      growth: "+80%",
      cagr: 80,
      valuation: "$75M",
      followers: 2341,
      isNew: false,
      tags: ["Healthcare", "Telemedicine", "AI"],
      featured: true,
    },
    {
      id: 4,
      name: "GreenEnergy Co",
      tagline: "Sustainable energy solutions",
      description: "Revolutionary solar panel technology for residential and commercial use.",
      logo: null,
      industry: "CleanTech",
      risk: "Medium",
      subscriptionType: "Paid",
      subscriptionFeeAmount: 499,
      minInvestment: 20000,
      rebalancing: "Weekly",
      stage: "Series A",
      funding: "$8M",
      fundingAmount: 8000000,
      location: "Pune, India",
      founded: "2020",
      teamSize: 35,
      growth: "+65%",
      cagr: 65,
      valuation: "$30M",
      followers: 1567,
      isNew: false,
      tags: ["CleanTech", "Energy", "B2B"],
      featured: false,
    },
    {
      id: 5,
      name: "FinFlow",
      tagline: "Smart financial management",
      description: "AI-driven personal finance and investment management platform.",
      logo: null,
      industry: "FinTech",
      risk: "High",
      subscriptionType: "Free access",
      subscriptionFeeAmount: 0,
      minInvestment: 3000,
      rebalancing: "On Need Basis",
      stage: "Pre-Seed",
      funding: "$500K",
      fundingAmount: 500000,
      location: "Hyderabad, India",
      founded: "2024",
      teamSize: 8,
      growth: "+200%",
      cagr: 200,
      valuation: "$2M",
      followers: 432,
      isNew: true,
      tags: ["FinTech", "B2C", "Mobile"],
      featured: false,
    },
    {
      id: 6,
      name: "CloudScale",
      tagline: "Enterprise cloud infrastructure",
      description: "Next-gen cloud infrastructure for scalable applications.",
      logo: null,
      industry: "Cloud Computing",
      risk: "Low",
      subscriptionType: "Fee-based",
      subscriptionFeeAmount: 1499,
      minInvestment: 40000,
      rebalancing: "Quarterly",
      stage: "Series C",
      funding: "$30M",
      fundingAmount: 30000000,
      location: "Bangalore, India",
      founded: "2019",
      teamSize: 120,
      growth: "+40%",
      cagr: 40,
      valuation: "$150M",
      followers: 3421,
      isNew: false,
      tags: ["Cloud", "Infrastructure", "B2B"],
      featured: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStartups(mockStartups);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and sort startups
  const filteredStartups = startups
    .filter((startup) => {
      const matchesSearch =
        searchQuery === "" ||
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk =
        riskLevel === "all" ||
        (riskLevel === "low" && startup.risk === "Low") ||
        (riskLevel === "medium" && startup.risk === "Medium") ||
        (riskLevel === "high" && startup.risk === "High");

      const matchesSubscription =
        subscriptionType === "all" || startup.subscriptionType === subscriptionType;

      const matchesFee =
        subscriptionFee === "all" ||
        (subscriptionFee === "under500" && startup.subscriptionFeeAmount < 500) ||
        (subscriptionFee === "under1500" && startup.subscriptionFeeAmount < 1500) ||
        (subscriptionFee === "above1500" && startup.subscriptionFeeAmount >= 1500);

      const matchesInvestment =
        investmentAmount === "any" ||
        (investmentAmount === "under5000" && startup.minInvestment < 5000) ||
        (investmentAmount === "under25000" && startup.minInvestment < 25000) ||
        (investmentAmount === "under50000" && startup.minInvestment < 50000);

      const matchesRebalancing =
        rebalancingFrequency === "all" ||
        startup.rebalancing === rebalancingFrequency;

      const matchesNew = !includeNew || startup.isNew;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesSubscription &&
        matchesFee &&
        matchesInvestment &&
        matchesRebalancing &&
        (includeNew ? matchesNew || !startup.isNew : true)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "returns":
          return (
            parseInt(b.growth.replace("%", "").replace("+", "")) -
            parseInt(a.growth.replace("%", "").replace("+", ""))
          );
        case "minAmount":
          return a.minInvestment - b.minInvestment;
        case "cagr":
          return b.cagr - a.cagr;
        default:
          return 0;
      }
    });



  const handleLike = (startupId) => {
    setLikedStartups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(startupId)) {
        newSet.delete(startupId);
      } else {
        newSet.add(startupId);
      }
      return newSet;
    });
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const stats = {
    totalStartups: startups.length,
    totalFunding: startups.reduce((sum, s) => sum + s.fundingAmount, 0),
    avgGrowth:
      startups.reduce(
        (sum, s) => sum + parseInt(s.growth.replace("%", "").replace("+", "")),
        0
      ) / startups.length,
    newThisMonth: startups.filter((s) => s.isNew).length,
  };

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="w-full py-6 px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Explore Startups
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover innovative startups and investment opportunities
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-cyber-border"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Main Carousel */}
          <StartupsCarousel stats={stats} setApi={setCarouselApi} />

          {/* Stats Cards */}
          <StartupsStats stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-3 space-y-4 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <FiltersSidebar
              riskLevel={riskLevel}
              setRiskLevel={setRiskLevel}
              subscriptionType={subscriptionType}
              setSubscriptionType={setSubscriptionType}
              subscriptionFee={subscriptionFee}
              setSubscriptionFee={setSubscriptionFee}
              investmentAmount={investmentAmount}
              setInvestmentAmount={setInvestmentAmount}
              rebalancingFrequency={rebalancingFrequency}
              setRebalancingFrequency={setRebalancingFrequency}
              includeNew={includeNew}
              setIncludeNew={setIncludeNew}
              collapsedSections={collapsedSections}
              toggleSection={toggleSection}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-cyber-card/50 border-cyber-border focus:border-neon-purple"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 md:w-64">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-cyber-card/50 border-cyber-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="returns">1Y Returns</SelectItem>
                    <SelectItem value="minAmount">Min Amount</SelectItem>
                    <SelectItem value="cagr">3Y CAGR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredStartups.length} of {startups.length} startups
              </p>
            </div>

            {/* Startups Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
              </div>
            ) : filteredStartups.length === 0 ? (
              <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No startups found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStartups.map((startup) => (
                  <StartupCard
                    key={startup.id}
                    startup={startup}
                    isLiked={likedStartups.has(startup.id)}
                    onLike={handleLike}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
