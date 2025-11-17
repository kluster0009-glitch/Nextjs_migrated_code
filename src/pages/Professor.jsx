'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Play, FileText, Video, BookOpen, User, Star, Eye } from 'lucide-react';

const Professor = () => {
  const featuredResource = {
    title: 'Effective Online Teaching Strategies',
    description: 'A comprehensive guide for professors to enhance student engagement and learning outcomes in virtual classroom environments.',
    author: 'Prof. Academic',
    date: 'Sep 15, 2024',
    type: 'Article'
  };

  const resources = [
    {
      id: 1,
      title: 'Navigating Research Grant Opportunities',
      description: 'An updated list of available research grants for faculty across various disciplines, with tips for successful application writing.',
      author: 'Prof. Academic',
      date: 'Sep 12',
      type: 'Document',
      rating: 4.8,
      views: 413
    },
    {
      id: 2,
      title: 'Supporting Student Mental Health & Well-being',
      description: 'Resources and guidelines for professors to identify, support, and refer students experiencing mental health challenges.',
      author: 'Prof. Academic',
      date: 'Sep 10',
      type: 'Link',
      rating: 4.8,
      views: 410
    },
    {
      id: 3,
      title: 'Interactive Lecture Techniques for Large Classes',
      description: 'Proven methods to increase student participation and engagement in lectures with 100+ students.',
      author: 'Prof. Academic',
      date: 'Sep 8',
      type: 'Video',
      rating: 4.8,
      views: 392
    },
    {
      id: 4,
      title: 'Understanding Academic Integrity Policies',
      description: 'A clear breakdown of institutional policies on plagiarism, cheating, and academic misconduct, with enforcement guidelines.',
      author: 'Prof. Academic',
      date: 'Sep 6',
      type: 'Document',
      rating: 4.8,
      views: 385
    }
  ];

  const resourceTypes = [
    { name: 'All Types', count: 5, active: true },
    { name: 'Lecture Notes', count: 0 },
    { name: 'Video Lectures', count: 0 },
    { name: 'Research Papers', count: 0 }
  ];

  const featuredProfessors = [
    { name: 'Dr. Sarah Chen', subject: 'Computer Science', initials: 'DSC', rating: 4.9 },
    { name: 'Prof. Michael Johnson', subject: 'Mathematics', initials: 'PMJ', rating: 4.9 },
    { name: 'Dr. Emily Rodriguez', subject: 'Physics', initials: 'DER', rating: 4.8 }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Document':
        return <FileText className="w-5 h-5 text-neon-cyan" />;
      case 'Video':
        return <Video className="w-5 h-5 text-neon-purple" />;
      case 'Link':
        return <BookOpen className="w-5 h-5 text-neon-green" />;
      default:
        return <FileText className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen immersive-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                Professor Corner
              </h1>
              <p className="text-muted-foreground">Access exclusive academic resources and insights from faculty members</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10 bg-cyber-card/50 border-cyber-border"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                  All Types
                </Button>
                <Button variant="ghost" size="sm">Lecture Notes</Button>
                <Button variant="ghost" size="sm">Video Lectures</Button>
                <Button variant="ghost" size="sm">Research Papers</Button>
              </div>
            </div>

            {/* Featured Resource */}
            <Card className="p-8 bg-cyber-card/50 backdrop-blur-sm border-cyber-border glow-border">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-black" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-3">
                      Featured Resource
                    </Badge>
                    <h2 className="text-2xl font-bold text-foreground mb-3">{featuredResource.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{featuredResource.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{featuredResource.author}</span>
                      </span>
                      <span>•</span>
                      <span>{featuredResource.date}</span>
                      <Badge variant="outline" className="border-neon-purple/30 text-neon-purple">
                        {featuredResource.type}
                      </Badge>
                    </div>
                    <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
                      <Play className="w-4 h-4 mr-2" />
                      Access Resource
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border hover:border-cyber-border/60 transition-all duration-300">
                  <div className="space-y-4">
                    {/* Resource Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-lg flex items-center justify-center border border-cyber-border">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 text-xs mb-2">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(resource.rating)}
                        <span className="text-sm text-muted-foreground ml-1">{resource.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {resource.description}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-2">
                          <User className="w-3 h-3" />
                          <span>{resource.author}</span>
                        </span>
                        <span>•</span>
                        <span>{resource.date}</span>
                      </div>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{resource.views}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/30">
                        Access
                      </Button>
                      <Button variant="outline" size="sm" className="border-cyber-border text-neon-purple hover:bg-neon-purple/20">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resource Types */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-cyan mb-4">Resource Types</h3>
              <div className="space-y-3">
                {resourceTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`${type.active ? 'text-neon-cyan' : 'text-foreground'}`}>{type.name}</span>
                    <Badge variant="outline" className="text-neon-purple border-neon-purple/30">
                      {type.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Featured Professors */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-purple mb-4">Featured Professors</h3>
              <div className="space-y-4">
                {featuredProfessors.map((prof, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">{prof.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{prof.name}</p>
                      <p className="text-xs text-muted-foreground">{prof.subject}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-muted-foreground">{prof.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-green mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Resources</span>
                  <span className="text-foreground font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Professors</span>
                  <span className="text-neon-cyan font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="text-neon-purple font-semibold">125K</span>
                </div>
              </div>
            </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Professor;