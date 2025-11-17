'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Download, Eye, FileText, Star } from 'lucide-react';

const Library = () => {
  const notes = [
    {
      id: 1,
      title: 'closing up',
      subject: 'Computer Science',
      rating: 4.5,
      description: 'No description provided.',
      author: 'Anonymous',
      date: 'Sep 21, 2025',
      downloads: 387,
      views: 514
    },
    {
      id: 2,
      title: 'closing up',
      subject: 'Computer Science',
      rating: 4.5,
      description: 'No description provided.',
      author: 'Anonymous',
      date: 'Sep 21, 2025',
      downloads: 177,
      views: 298
    },
    {
      id: 3,
      title: 'closing up',
      subject: 'Computer Science',
      rating: 4.5,
      description: 'No description provided.',
      author: 'Anonymous',
      date: 'Sep 21, 2025',
      downloads: 301,
      views: 432
    },
    {
      id: 4,
      title: 'Introduction to Python Programming',
      subject: 'Computer Science',
      rating: 4.5,
      description: 'Comprehensive notes covering Python basics, data structures, and algorithms. Includes code examples and practice exercises.',
      author: 'Alex Chen',
      date: 'Mar 15, 2024',
      downloads: 514,
      views: 892
    },
    {
      id: 5,
      title: 'Organic Chemistry Reaction Mechanisms',
      subject: 'Chemistry',
      rating: 4.5,
      description: 'Detailed diagrams and explanations for common organic reaction mechanisms (SN1, SN2, E1, E2). Essential for exam prep.',
      author: 'Dr. Emily White',
      date: 'Mar 10, 2024',
      downloads: 89,
      views: 156
    },
    {
      id: 6,
      title: 'Microeconomics: Supply and Demand Fundamentals',
      subject: 'Economics',
      rating: 4.5,
      description: 'Lecture summary and practice problems on supply, demand, elasticity, and market equilibrium. Great for beginners.',
      author: 'Sarah Lee',
      date: 'Mar 8, 2024',
      downloads: 93,
      views: 187
    }
  ];

  const subjects = ['All Subjects', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'];
  const popularSubjects = [
    { name: 'Computer Science', count: 4 },
    { name: 'Mathematics', count: 1 },
    { name: 'Physics', count: 0 },
    { name: 'Chemistry', count: 1 },
    { name: 'Biology', count: 0 },
    { name: 'Economics', count: 0 }
  ];

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Shared Notes Library
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notes..."
                  className="pl-10 bg-cyber-card/50 border-cyber-border"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                  All Subjects
                </Button>
                <Button variant="ghost" size="sm">Computer Science</Button>
                <Button variant="ghost" size="sm">Mathematics</Button>
                <Button variant="ghost" size="sm">Physics</Button>
              </div>
            </div>

            {/* Upload Notes */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
                <Upload className="w-4 h-4 mr-2" />
                Upload Notes
              </Button>
            </Card>

            {/* Notes Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {notes.map((note) => (
                <Card key={note.id} className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border hover:border-cyber-border/60 transition-all duration-300">
                  <div className="space-y-4">
                    {/* Note Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-lg flex items-center justify-center border border-cyber-border">
                          <FileText className="w-6 h-6 text-neon-cyan" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{note.title}</h3>
                          <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 text-xs">
                            {note.subject}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(note.rating)}
                        <span className="text-sm text-muted-foreground ml-1">{note.rating}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {note.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span>By {note.author}</span>
                          <span>•</span>
                          <span>{note.date}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{note.views}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{note.downloads}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/30">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="border-cyber-border text-neon-purple hover:bg-neon-purple/20">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Subjects */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-cyan mb-4">Popular Subjects</h3>
              <div className="space-y-3">
                {popularSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-foreground">{subject.name}</span>
                    <Badge variant="outline" className="text-neon-purple border-neon-purple/30">
                      {subject.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Library Stats */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-green mb-4">Library Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Notes</span>
                  <span className="text-foreground font-semibold">9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="text-neon-cyan font-semibold">12.5K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributors</span>
                  <span className="text-neon-purple font-semibold">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="text-neon-green font-semibold">+24 notes</span>
                </div>
              </div>
            </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Library;