'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown, Star, MessageSquare, FileText, HelpCircle, ThumbsUp } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('all time');
  const [activeSection, setActiveSection] = useState('Overall');

  const topContributors = [
    {
      name: 'Alex Chen',
      university: 'MIT',
      initials: 'AC',
      points: 2850,
      position: 1,
      badge: 'Champion',
      stats: { questions: 45, answers: 128, notes: 23, helpful: 89 }
    },
    {
      name: 'Sarah Johnson',
      university: 'Stanford',
      initials: 'SJ',
      points: 2640,
      position: 2,
      badge: 'Knowledge Sharer',
      stats: { questions: 38, answers: 112, notes: 31, helpful: 76 }
    },
    {
      name: 'Mike Rodriguez',
      university: 'Berkeley',
      initials: 'MR',
      points: 2420,
      position: 3,
      badge: 'Community Helper',
      stats: { questions: 52, answers: 95, notes: 18, helpful: 82 }
    }
  ];

  const completeRankings = [
    {
      position: 1,
      name: 'Alex Chen',
      title: 'Expert Contributor',
      university: 'MIT',
      initials: 'AC',
      points: 2850,
      stats: { questions: 45, answers: 128, notes: 23, helpful: 89 }
    },
    {
      position: 2,
      name: 'Sarah Johnson',
      title: 'Knowledge Sharer',
      university: 'Stanford',
      initials: 'SJ',
      points: 2640,
      stats: { questions: 38, answers: 112, notes: 31, helpful: 76 }
    },
    {
      position: 3,
      name: 'Mike Rodriguez',
      title: 'Community Helper',
      university: 'Berkeley',
      initials: 'MR',
      points: 2420,
      stats: { questions: 52, answers: 95, notes: 18, helpful: 82 }
    },
    {
      position: 4,
      name: 'Emma Wilson',
      title: 'Study Guide Master',
      university: 'Harvard',
      initials: 'EW',
      points: 2180,
      stats: { questions: 29, answers: 87, notes: 42, helpful: 71 }
    },
    {
      position: 5,
      name: 'David Kim',
      title: 'Problem Solver',
      university: 'Caltech',
      initials: 'DK',
      points: 1950,
      stats: { questions: 41, answers: 73, notes: 15, helpful: 68 }
    }
  ];

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">{position}</span>;
    }
  };

  const getBadgeColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 2:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
      case 3:
        return 'bg-amber-600/20 text-amber-600 border-amber-600/30';
      default:
        return 'bg-neon-purple/20 text-neon-purple border-neon-purple/30';
    }
  };

  return (
    <div className="min-h-screen immersive-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                Leaderboard
              </h1>
              <p className="text-muted-foreground">Celebrate the top contributors in our academic community</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Time Period Tabs */}
            <div className="flex space-x-2">
              {['all time', 'this month', 'this week'].map((period) => (
                <Button
                  key={period}
                  variant={activeTab === period ? "default" : "ghost"}
                  onClick={() => setActiveTab(period)}
                  className={`
                    ${activeTab === period 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {period}
                </Button>
              ))}
            </div>

            {/* Section Tabs */}
            <div className="flex space-x-2">
              {['Overall', 'Categories', 'Achievements'].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "ghost"}
                  onClick={() => setActiveSection(section)}
                  className={`
                    ${activeSection === section 
                      ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {section}
                </Button>
              ))}
            </div>

            {/* Top Contributors Podium */}
            <Card className="p-8 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span>Top Contributors</span>
                </h2>
              </div>

              <div className="flex items-end justify-center space-x-8">
                {/* Second Place */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white font-bold text-lg">{topContributors[1].initials}</span>
                  </div>
                  <div className="mb-2">
                    <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">{topContributors[1].name}</h3>
                    <p className="text-sm text-muted-foreground">{topContributors[1].university}</p>
                    <p className="text-lg font-bold text-gray-400">{topContributors[1].points} pts</p>
                  </div>
                </div>

                {/* First Place */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-black font-bold text-xl">{topContributors[0].initials}</span>
                  </div>
                  <div className="mb-2">
                    <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">{topContributors[0].name}</h3>
                    <p className="text-sm text-muted-foreground">{topContributors[0].university}</p>
                    <p className="text-xl font-bold text-yellow-400">{topContributors[0].points} pts</p>
                    <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mt-2">
                      {topContributors[0].badge}
                    </Badge>
                  </div>
                </div>

                {/* Third Place */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white font-bold text-lg">{topContributors[2].initials}</span>
                  </div>
                  <div className="mb-2">
                    <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">{topContributors[2].name}</h3>
                    <p className="text-sm text-muted-foreground">{topContributors[2].university}</p>
                    <p className="text-lg font-bold text-amber-600">{topContributors[2].points} pts</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Complete Rankings */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Complete Rankings</h3>
              <div className="space-y-4">
                {completeRankings.map((user) => (
                  <div key={user.position} className="flex items-center space-x-4 p-4 bg-cyber-darker/30 rounded-lg border border-cyber-border/50">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getPositionIcon(user.position)}
                    </div>
                    
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold">{user.initials}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-semibold text-foreground">{user.name}</h4>
                        <Badge className={getBadgeColor(user.position)}>
                          {user.title}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.university}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center space-x-1">
                          <HelpCircle className="w-3 h-3" />
                          <span>{user.stats.questions} questions</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{user.stats.answers} answers</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{user.stats.notes} notes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{user.stats.helpful} helpful</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-neon-cyan">{user.points}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Ranking */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-purple mb-4">Your Ranking</h3>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-lg">YU</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">You</p>
                  <p className="text-2xl font-bold text-neon-cyan">1,250</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 mt-2">
                    Rank #42
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Community Stats */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-green mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Users</span>
                  <span className="text-foreground font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active This Week</span>
                  <span className="text-neon-cyan font-semibold">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Points Awarded</span>
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

export default Leaderboard;