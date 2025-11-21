'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Plus,
  Filter,
  Star,
  Share2,
  Bookmark,
  CalendarPlus,
  UserCheck,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import CreateEventDialog from '@/components/CreateEventDialog'

export default function EventsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [addingToCalendar, setAddingToCalendar] = useState({})
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
    if (user) {
      fetchRegisteredEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events_with_stats')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchRegisteredEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('status', 'registered')

      if (error) throw error
      setRegisteredEvents(data.map(r => r.event_id))
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const handleEventCreated = (newEvent) => {
    fetchEvents()
  }

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please login to register for events')
      return
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
            status: 'registered'
          }
        ])

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already registered for this event')
        } else {
          throw error
        }
        return
      }

      toast.success('Successfully registered for event!')
      setRegisteredEvents([...registeredEvents, eventId])
      fetchEvents() // Refresh to update attendee count
    } catch (error) {
      console.error('Error registering for event:', error)
      toast.error('Failed to register for event')
    }
  }

  const handleAddToCalendar = async (event) => {
    if (!user) {
      toast.error('Please login to add events to your calendar')
      return
    }

    setAddingToCalendar({ ...addingToCalendar, [event.id]: true })

    try {
      const eventDate = new Date(event.event_date)
      const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000) // Default 2 hours

      const { error } = await supabase
        .from('calendar_events')
        .insert([
          {
            user_id: user.id,
            title: event.title,
            description: event.description,
            start_time: eventDate.toISOString(),
            end_time: endDate.toISOString(),
            location: event.location,
            event_type: 'meeting',
            calendar_type: 'personal',
            color: getCategoryColorForCalendar(event.category),
            event_id: event.id,
            rsvp_status: 'yes'
          }
        ])

      if (error) {
        if (error.code === '23505') {
          toast.error('Event already added to your calendar')
        } else {
          throw error
        }
        return
      }

      toast.success('Event added to your calendar!')
    } catch (error) {
      console.error('Error adding to calendar:', error)
      toast.error('Failed to add event to calendar')
    } finally {
      setAddingToCalendar({ ...addingToCalendar, [event.id]: false })
    }
  }

  const getCategoryColorForCalendar = (category) => {
    const colors = {
      'Technology': 'bg-blue-500',
      'Competition': 'bg-purple-500',
      'Career': 'bg-green-500',
      'Cultural': 'bg-pink-500',
      'Sports': 'bg-orange-500',
      'Academic': 'bg-indigo-500',
      'Workshop': 'bg-yellow-500',
      'Social': 'bg-teal-500'
    }
    return colors[category] || 'bg-blue-500'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
      'Competition': 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
      'Career': 'bg-green-500/20 text-green-500 border-green-500/30',
      'Cultural': 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
      'Sports': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      'Academic': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
      'Workshop': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      'Social': 'bg-teal-500/20 text-teal-500 border-teal-500/30'
    }
    return colors[category] || 'bg-muted/20 text-muted-foreground border-muted/30'
  }

  const isRegistered = (eventId) => {
    return registeredEvents.includes(eventId)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'upcoming') {
      return matchesSearch && new Date(event.event_date) >= new Date()
    }
    if (activeTab === 'featured') {
      return matchesSearch && event.featured
    }
    if (activeTab === 'my-events') {
      return matchesSearch && isRegistered(event.id)
    }
    return matchesSearch
  })

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
            <CreateEventDialog onEventCreated={handleEventCreated} />
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
        <Tabs defaultValue="all" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-cyber-card/50 border border-cyber-border">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
                <CardContent className="py-12 text-center">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'my-events' 
                      ? 'Events you register for will appear here.'
                      : 'Check back later for new events.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
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

                    <CardContent className="space-y-4">
                      {/* Two lines of event details */}
                      <div className="space-y-2">
                        {/* Line 1: Date + Time */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1">
                            <CalendarIcon className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                            <span>{format(new Date(event.event_date), 'MMMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1">
                            <Clock className="w-4 h-4 text-neon-purple flex-shrink-0" />
                            <span>{format(new Date(event.event_date), 'HH:mm')}</span>
                          </div>
                        </div>

                        {/* Line 2: Location + Attendees */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1">
                            <MapPin className="w-4 h-4 text-neon-pink flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-1">
                            <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{event.attendees_count || 0} / {event.max_attendees}</span>
                          </div>
                        </div>

                        {/* Progress bar for attendees */}
                        <div className="w-full bg-cyber-darker rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all"
                            style={{ width: `${((event.attendees_count || 0) / event.max_attendees) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Event Image */}
                      {event.image_url && (
                        <div className="w-full overflow-hidden rounded-lg">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex gap-2">
                      {isRegistered(event.id) ? (
                        <Button 
                          className="flex-1 bg-green-500/20 text-green-500 border border-green-500/30 hover:bg-green-500/30"
                          disabled
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Registered
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
                          onClick={() => handleRegister(event.id)}
                          disabled={event.is_full}
                        >
                          {event.is_full ? 'Event Full' : 'Register Now'}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-cyber-border"
                        onClick={() => handleAddToCalendar(event)}
                        disabled={addingToCalendar[event.id]}
                      >
                        {addingToCalendar[event.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CalendarPlus className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="icon" className="border-cyber-border">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
