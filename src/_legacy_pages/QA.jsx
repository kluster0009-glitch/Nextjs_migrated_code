'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, MessageSquare } from 'lucide-react';

const QA = () => {
  const questions = [
    {
      id: 1,
      title: 'Best resources for mastering Calculus II?',
      content: "I'm really struggling with Calculus II, especially integration techniques and series. Are there any specific online resources, textbooks, or study groups that anyone found particularly helpful? I'm looking for something that explains concepts clearly and provides plenty of practice problems.",
      author: 'Anonymous',
      date: 'Sep 15, 2024',
      upvotes: 125,
      answers: 38,
      tags: ['Calculus', 'Math', 'StudyTips', 'Academics'],
      status: 'unanswered'
    },
    {
      id: 2,
      title: 'Trouble installing NumPy with Anaconda on Mac M1',
      content: "I'm trying to set up my data science environment on my new MacBook Air M1, and I'm encountering issues installing NumPy via Anaconda. It keeps giving me a 'conda environment not found' error, even though I've activated my base environment. Hone faced this and found a solution?",
      author: 'Anonymous',
      date: 'Sep 12, 2024',
      upvotes: 87,
      answers: 18,
      tags: ['Python', 'DataScience', 'Anaconda', 'MacOS', 'Programming'],
      status: 'resolved'
    },
    {
      id: 3,
      title: 'Tips for finding effective study groups in Computer Science?',
      content: "As a first-year CS student, I'm looking to join or form a study group for my core courses (Intro to Programming, Discrete Math). What are the best ways to find motivated peers? Are there specific platforms or campus spots where students usually connect for this?",
      author: 'Anonymous',
      date: 'Sep 10, 2024',
      upvotes: 62,
      answers: 21,
      tags: ['ComputerScience', 'StudyGroups', 'Freshmen', 'CampusLife'],
      status: 'unanswered'
    },
    {
      id: 4,
      title: "Clarification on Professor Davies' research paper requirements for 'Modern Physics'",
      content: "Can someone help clarify the specific formatting and citation requirements for the research paper in Professor Davies' Modern Physics course? The syllabus mentions APA format, but there seems to be some confusion about the bibliography section.",
      author: 'Anonymous',
      date: 'Sep 8, 2024',
      upvotes: 45,
      answers: 12,
      tags: ['Physics', 'AcademicWriting', 'ResearchPaper', 'ModernPhysics'],
      status: 'resolved'
    }
  ];

  const popularTags = [
    'JavaScript', 'Python', 'React', 'Data Structures', 'Algorithms', 
    'Machine Learning', 'Web Development', 'Database'
  ];

  return (
    <div className="min-h-screen immersive-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Questions & Answers
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
                  placeholder="Search questions..."
                  className="pl-10 bg-cyber-card/50 border-cyber-border"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
                  Recent
                </Button>
                <Button variant="ghost" size="sm">Popular</Button>
                <Button variant="ghost" size="sm">Unanswered</Button>
              </div>
            </div>

            {/* Ask Question */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </Card>

            {/* Questions List */}
            {questions.map((question) => (
              <Card key={question.id} className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border hover:border-cyber-border/60 transition-all duration-300">
                <div className="space-y-4">
                  {/* Question Stats */}
                  <div className="flex items-start space-x-4">
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-neon-cyan">{question.upvotes}</div>
                      <div className="text-xs text-muted-foreground">votes</div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-2xl font-bold text-neon-purple">{question.answers}</div>
                      <div className="text-xs text-muted-foreground">answers</div>
                    </div>
                    
                    {/* Question Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-semibold text-foreground hover:text-neon-cyan cursor-pointer transition-colors">
                          {question.title}
                        </h3>
                        {question.status === 'resolved' && (
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 ml-2">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {question.content}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-cyber-border text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/30 cursor-pointer transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Question Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{question.author}</span>
                          <span>•</span>
                          <span>{question.date}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-neon-cyan hover:text-neon-cyan/80">
                          Answer Question
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-cyan mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer hover:bg-neon-purple/20 hover:text-neon-purple hover:border-neon-purple/30 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Q&A Stats */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-green mb-4">Q&A Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Questions</span>
                  <span className="text-foreground font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolved</span>
                  <span className="text-neon-green font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unanswered</span>
                  <span className="text-neon-cyan font-semibold">3</span>
                </div>
              </div>
            </Card>

            {/* How to Ask */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-purple mb-4">How to Ask</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific and clear in your title</li>
                <li>• Provide context and details</li>
                <li>• Add relevant tags</li>
                <li>• Show what you've tried</li>
                <li>• Be respectful and constructive</li>
              </ul>
            </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QA;