'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Plus,
  Filter,
  Star,
  Share2,
  Bookmark
} from 'lucide-react'
import { format } from 'date-fns'

export default function EventsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Tech Talk: AI in Education',
      description: 'Join us for an insightful discussion on how AI is transforming the education landscape.',
      date: new Date(2024, 11, 25),
      time: '14:00',
      location: 'Auditorium Hall A',
      attendees: 45,
      maxAttendees: 100,
      category: 'Technology',
      organizer: 'CS Department',
      featured: true
    },
    {
      id: 2,
      title: 'Campus Hackathon 2024',
      description: '24-hour coding challenge with amazing prizes and networking opportunities.',
      date: new Date(2024, 11, 28),
      time: '09:00',
      location: 'Innovation Lab',
      attendees: 89,
      maxAttendees: 120,
      category: 'Competition',
      organizer: 'Student Union',
      featured: true
    },
    {
      id: 3,
      title: 'Career Fair',
      description: 'Meet with top companies and explore internship and job opportunities.',
      date: new Date(2024, 11, 30),
      time: '10:00',
      location: 'Main Campus Ground',
      attendees: 234,
      maxAttendees: 500,
      category: 'Career',
      organizer: 'Placement Cell',
      featured: false
    },
    {
      id: 4,
      title: 'Music Festival',
      description: 'Annual music fest featuring local bands and student performances.',
      date: new Date(2025, 0, 5),
      time: '18:00',
      location: 'Open Air Theatre',
      attendees: 156,
      maxAttendees: 300,
      category: 'Cultural',
      organizer: 'Cultural Committee',
      featured: false
    }
  ]

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
      'Competition': 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
      'Career': 'bg-green-500/20 text-green-500 border-green-500/30',
      'Cultural': 'bg-neon-pink/20 text-neon-pink border-neon-pink/30'
    }
    return colors[category] || 'bg-muted/20 text-muted-foreground border-muted/30'
  }

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Campus Events
              </h1>
              <p className="text-muted-foreground">
                Discover and join exciting events happening on campus
              </p>
            </div>
            <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-cyber-card/50 border-cyber-border"
              />
            </div>
            <Button variant="outline" className="border-cyber-border">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-cyber-card/50 border border-cyber-border">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl hover:border-neon-cyan/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${getCategoryColor(event.category)} border`}>
                        {event.category}
                      </Badge>
                      {event.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-neon-cyan" />
                      <span>{format(event.date, 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-neon-purple" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-neon-pink" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>{event.attendees} / {event.maxAttendees} attendees</span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-cyber-darker rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all"
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
                      Register Now
                    </Button>
                    <Button variant="outline" size="icon" className="border-cyber-border">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-cyber-border">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
                <p className="text-muted-foreground">Your upcoming events will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.filter(e => e.featured).map((event) => (
                <Card key={event.id} className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${getCategoryColor(event.category)} border`}>
                        {event.category}
                      </Badge>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(event.date, 'MMMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
                      Register Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-events">
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No registered events</h3>
                <p className="text-muted-foreground">Events you register for will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
