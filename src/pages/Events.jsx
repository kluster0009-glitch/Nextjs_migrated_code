'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Users, Heart, Clock } from 'lucide-react';

const Events = () => {
  const [activeTab, setActiveTab] = useState('Events');

  const events = [
    {
      id: 1,
      title: 'Welcome Back Social Mixer',
      description: 'Kick off the new semester with fellow students and faculty! Enjoy free food, music, and fun activities. A great chance to meet new people and reconnect with old friends.',
      date: 'Sep 4, 2024',
      time: '18:00',
      location: 'University Commons Ballroom',
      interested: 64,
      status: 'Upcoming',
      image: true
    },
    {
      id: 2,
      title: 'Effective Study Habits Workshop',
      description: 'Learn proven strategies for time management, note-taking, and exam preparation. Boost your academic performance with tips from academic success coaches.',
      date: 'Sep 19, 2024',
      time: '14:30',
      location: 'Library Auditorium',
      interested: 200,
      status: 'Upcoming',
      image: true
    },
    {
      id: 3,
      title: 'Mindfulness & Stress Relief Session',
      description: 'A guided session focusing on mindfulness techniques and practical stress relief exercises to help students manage academic pressures and promote well-being.',
      date: 'Sep 30, 2024',
      time: '16:00',
      location: 'Student Wellness Center',
      interested: 180,
      status: 'Upcoming',
      image: true
    },
    {
      id: 4,
      title: 'Annual Career & Internship Fair',
      description: 'Connect with top employers and explore internship and career opportunities. Over 150 companies will be present, including tech giants, startups, and government agencies.',
      date: 'Oct 15, 2024',
      time: '10:00',
      location: 'Athletic Center',
      interested: 850,
      status: 'Upcoming',
      image: true
    }
  ];

  const upcomingEvents = [
    { title: 'Welcome Back Social Mixer', date: 'Sep 4' },
    { title: 'Effective Study Habits Workshop', date: 'Sep 19' },
    { title: 'Mindfulness & Stress Relief Session', date: 'Sep 30' }
  ];

  return (
    <div className="min-h-screen immersive-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Events & Clubs
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events and clubs..."
                className="pl-10 bg-cyber-card/50 border-cyber-border"
              />
            </div>

            {/* Tabs */}
            <div className="flex space-x-2">
              {['Events', 'Clubs'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    ${activeTab === tab 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-6">
              {events.map((event) => (
                <Card key={event.id} className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border hover:border-cyber-border/60 transition-all duration-300">
                  <div className="flex space-x-6">
                    {/* Event Image */}
                    <div className="w-48 h-32 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-lg border border-cyber-border flex items-center justify-center flex-shrink-0">
                      <span className="text-muted-foreground">📸 Event Image</span>
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        
                          <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                            {event.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {event.location}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {event.interested} interested</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20">
                            <Heart className="w-4 h-4 mr-2" />
                            Interested
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
                            Register
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming This Week */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-cyan mb-4">Upcoming This Week</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Event Stats */}
            <Card className="p-6 bg-cyber-card/50 backdrop-blur-sm border-cyber-border">
              <h3 className="text-lg font-semibold text-neon-green mb-4">Event Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Events</span>
                  <span className="text-foreground font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="text-neon-cyan font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendees</span>
                  <span className="text-neon-purple font-semibold">2.5K</span>
                </div>
              </div>
            </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Events;
