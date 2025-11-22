"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap } from "lucide-react";

/**
 * ProjectCard Component
 * 
 * Displays a project card with image, title, description, and collaborators.
 * Matches the existing theme and styling used in posts.
 * 
 * @param {Object} project - The project data
 * @param {Function} onViewProject - Callback when "View Project" is clicked
 */
export function ProjectCard({ project, onViewProject }) {
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl hover:shadow-lg hover:shadow-neon-cyan/10 transition-all duration-300">
      <CardContent className="p-0">
        {/* Project Image */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-cyber-darker/50">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10">
              <Users className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          {/* TODO: Add project status badge (e.g., "Active", "Completed") */}
          {project.status && (
            <Badge className="absolute top-3 right-3 bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
              {project.status}
            </Badge>
          )}
        </div>

        {/* Project Details */}
        <div className="p-6">
          {/* Project Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Collaborators Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="font-semibold">Collaborators:</span>
            </div>

            {/* Students */}
            {project.students && project.students.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-xs font-medium text-neon-cyan">Students</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.students.map((student, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-cyber-darker/50 rounded-full pl-1 pr-3 py-1 border border-cyber-border"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xs">
                          {getUserInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-foreground">{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professors */}
            {project.professors && project.professors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-neon-purple" />
                  <span className="text-xs font-medium text-neon-purple">Professors</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.professors.map((professor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-cyber-darker/50 rounded-full pl-1 pr-3 py-1 border border-cyber-border"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={professor.avatar} />
                        <AvatarFallback className="bg-neon-purple/20 text-neon-purple text-xs">
                          {getUserInitials(professor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-foreground">{professor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 border-t border-cyber-border mt-4">
        <Button
          onClick={() => onViewProject(project)}
          className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all duration-300"
        >
          View Project
        </Button>
      </CardFooter>
    </Card>
  );
}
