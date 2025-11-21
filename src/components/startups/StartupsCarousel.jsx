import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TrendingUp, DollarSign, Building2 } from "lucide-react";

export default function StartupsCarousel({ stats, setApi }) {
  return (
    <div className="mb-6">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          <CarouselItem>
            <Card className="border-cyber-border bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                      🚀 Featured Startups
                    </h3>
                    <p className="text-muted-foreground">
                      Discover high-growth opportunities with verified track records
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-neon-cyan" />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card className="border-cyber-border bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                      💎 Premium Investments
                    </h3>
                    <p className="text-muted-foreground">
                      Access exclusive Series A & B funding opportunities
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-neon-purple" />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem>
            <Card className="border-cyber-border bg-gradient-to-r from-neon-pink/10 via-neon-cyan/10 to-neon-purple/10 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-neon-pink to-neon-cyan bg-clip-text text-transparent">
                      🌟 New This Month
                    </h3>
                    <p className="text-muted-foreground">
                      {stats.newThisMonth} new startups looking for investors
                    </p>
                  </div>
                  <Building2 className="w-12 h-12 text-neon-pink" />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4 bg-cyber-card/80 border-cyber-border hover:bg-cyber-card hover:border-neon-cyan/50 text-foreground" />
        <CarouselNext className="hidden sm:flex -right-4 bg-cyber-card/80 border-cyber-border hover:bg-cyber-card hover:border-neon-cyan/50 text-foreground" />
      </Carousel>
    </div>
  );
}
