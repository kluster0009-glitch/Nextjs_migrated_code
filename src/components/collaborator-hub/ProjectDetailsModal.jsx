"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react";

/**
 * ProjectDetailsModal Component
 * 
 * Displays expanded project details in a modal dialog.
 * Shows full description, research papers, media, and collaborators.
 * Matches the existing theme and styling.
 * 
 * @param {boolean} open - Whether the modal is open
 * @param {Function} onOpenChange - Callback to change modal state
 * @param {Object} project - The project data to display
 */
export function ProjectDetailsModal({ open, onOpenChange, project }) {
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-cyber-card/95 backdrop-blur-xl border-cyber-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            {project.title}
            {project.status && (
              <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                {project.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Collaborative Research Project
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Project Image */}
            {project.image && (
              <div className="w-full h-64 rounded-lg overflow-hidden border border-cyber-border">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Project Metadata */}
            <div className="flex flex-wrap gap-4 text-sm">
              {/* TODO: Add actual project metadata from database */}
              {project.category && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <span>{project.category}</span>
                </div>
              )}
              {project.startDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Started: {project.startDate}</span>
                </div>
              )}
            </div>

            <Separator className="bg-cyber-border" />

            {/* Full Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neon-cyan" />
                Project Description
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
              {/* TODO: Add rich text editor support for formatted descriptions */}
            </div>

            <Separator className="bg-cyber-border" />

            {/* Collaborators */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-cyan" />
                Collaborators
              </h3>

              {/* Students */}
              {project.students && project.students.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm font-medium text-neon-cyan">Students</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.students.map((student, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-cyber-darker/50 border border-cyber-border hover:border-neon-cyan/30 transition-colors"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                            {getUserInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {student.name}
                          </p>
                          {student.department && (
                            <p className="text-xs text-muted-foreground truncate">
                              {student.department}
                            </p>
                          )}
                        </div>
                        {/* TODO: Add link to student profile */}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professors */}
              {project.professors && project.professors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm font-medium text-neon-purple">Professors</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.professors.map((professor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-cyber-darker/50 border border-cyber-border hover:border-neon-purple/30 transition-colors"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={professor.avatar} />
                          <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                            {getUserInitials(professor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {professor.name}
                          </p>
                          {professor.department && (
                            <p className="text-xs text-muted-foreground truncate">
                              {professor.department}
                            </p>
                          )}
                        </div>
                        {/* TODO: Add link to professor profile */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-cyber-border" />

            {/* Research Papers Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neon-cyan" />
                Research Papers
              </h3>
              {/* TODO: Integrate with database to fetch research papers */}
              {project.papers && project.papers.length > 0 ? (
                <div className="space-y-3">
                  {project.papers.map((paper, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-cyber-darker/50 border border-cyber-border hover:border-neon-cyan/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">
                            {paper.title}
                          </h4>
                          {paper.authors && (
                            <p className="text-xs text-muted-foreground mb-2">
                              By: {paper.authors}
                            </p>
                          )}
                          {paper.abstract && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {paper.abstract}
                            </p>
                          )}
                        </div>
                        {paper.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10"
                            onClick={() => window.open(paper.url, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-cyber-border rounded-lg">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No research papers added yet
                  </p>
                  {/* TODO: Add button to upload/link research papers */}
                </div>
              )}
            </div>

            <Separator className="bg-cyber-border" />

            {/* Additional Media Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-neon-cyan" />
                Project Media
              </h3>
              {/* TODO: Integrate with media upload functionality */}
              {project.media && project.media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.media.map((mediaItem, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden border border-cyber-border hover:border-neon-cyan/30 transition-colors"
                    >
                      {mediaItem.type === "image" ? (
                        <img
                          src={mediaItem.url}
                          alt={`Project media ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : mediaItem.type === "video" ? (
                        <video
                          src={mediaItem.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-cyber-border rounded-lg">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No additional media added yet
                  </p>
                  {/* TODO: Add button to upload media */}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
