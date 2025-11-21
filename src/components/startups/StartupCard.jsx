import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function StartupCard({ startup, isLiked, onLike }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`border-cyber-border bg-cyber-card/50 backdrop-blur-xl hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10 cursor-pointer ${
        startup.featured ? "ring-2 ring-neon-purple/30" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-cyber-border">
              <AvatarImage src={startup.logo} />
              <AvatarFallback className="bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 text-neon-cyan font-bold">
                {getInitials(startup.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{startup.name}</CardTitle>
                {startup.isNew && (
                  <Badge className="bg-neon-pink/20 text-neon-pink border-neon-pink/30">
                    New
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {startup.tagline}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike(startup.id);
            }}
            className={`${
              isLiked ? "text-neon-pink" : "text-muted-foreground"
            } hover:text-neon-pink`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {startup.tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="bg-cyber-darker/50 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {startup.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-neon-cyan" />
            <div>
              <p className="text-xs text-muted-foreground">Funding</p>
              <p className="font-semibold text-neon-cyan">{startup.funding}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Growth</p>
              <p className="font-semibold text-green-500">{startup.growth}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-neon-purple" />
            <div>
              <p className="text-xs text-muted-foreground">Team Size</p>
              <p className="font-semibold">{startup.teamSize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge
              variant="outline"
              className="border-neon-cyan/30 text-neon-cyan"
            >
              {startup.stage}
            </Badge>
          </div>
        </div>

        {/* Location and Year */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{startup.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Founded {startup.founded}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-cyber-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{startup.followers.toLocaleString()} followers</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-neon-cyan hover:text-neon-cyan"
          >
            <span>View Details</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
