'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MoreHorizontal,
  Loader2,
  Trash2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function CalendarPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [events, setEvents] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCalendars, setActiveCalendars] = useState(['personal', 'work']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCalendarEvents();
    }
  }, [user]);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Event deleted successfully');
      setSelectedEvent(null);
      fetchCalendarEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === date.toDateString() &&
             activeCalendars.includes(event.calendar_type);
    });
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const today = new Date();

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-border/40" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const dayEvents = getEventsForDate(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`min-h-24 p-2 border border-border/40 cursor-pointer hover:bg-accent/50 transition-colors ${
            isSelected ? 'bg-accent' : ''
          }`}
        >
          <div className={`text-sm font-semibold ${
            isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : ''
          }`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                }}
                className={`text-xs p-1 rounded truncate ${event.color} text-white`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 font-semibold text-center bg-muted border-b border-border">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex gap-0 border border-border rounded-lg overflow-hidden">
        <div className="w-16 bg-muted">
          <div className="h-16 border-b border-border" />
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b border-border p-2 text-xs text-muted-foreground">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 gap-0">
          {weekDays.map((day, idx) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const dayEvents = getEventsForDate(day);
            
            return (
              <div key={idx} className="border-l border-border">
                <div className={`h-16 p-2 text-center border-b border-border ${isToday ? 'bg-primary/10' : ''}`}>
                  <div className="text-xs text-muted-foreground">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>{day.getDate()}</div>
                </div>
                <div className="relative">
                  {hours.map(hour => (
                    <div key={hour} className="h-20 border-b border-border" />
                  ))}
                  {dayEvents.map(event => {
                    const eventHour = new Date(event.start_time).getHours();
                    const eventMinutes = new Date(event.start_time).getMinutes();
                    const startTime = new Date(event.start_time);
                    const endTime = new Date(event.end_time);
                    const duration = (endTime - startTime) / (1000 * 60); // duration in minutes
                    const top = (eventHour * 80) + (eventMinutes / 60 * 80) + 64;
                    const height = (duration / 60) * 80;
                    
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        className={`absolute left-1 right-1 ${event.color} text-white p-2 rounded text-xs cursor-pointer hover:opacity-90`}
                      >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderActivityHeatmap = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm'];
    
    // Mock activity data (0-4 intensity)
    const activityData = Array.from({ length: 7 }, () => 
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Work Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 justify-around text-xs text-muted-foreground">
              {hours.map(h => <div key={h} className="h-8">{h}</div>)}
            </div>
            <div className="flex gap-1">
              {days.map((day, dayIdx) => (
                <div key={day} className="flex flex-col gap-1">
                  <div className="text-xs text-center text-muted-foreground h-4">{day}</div>
                  {activityData[dayIdx].map((intensity, hourIdx) => (
                    <div
                      key={hourIdx}
                      className={`w-8 h-8 rounded ${
                        intensity === 0 ? 'bg-muted' :
                        intensity === 1 ? 'bg-primary/20' :
                        intensity === 2 ? 'bg-primary/40' :
                        intensity === 3 ? 'bg-primary/60' :
                        'bg-primary/80'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUpcomingEvents = () => {
    const upcoming = events
      .filter(e => new Date(e.start_time) >= new Date() && activeCalendars.includes(e.calendar_type))
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 3);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
          ) : (
            upcoming.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <div className={`w-2 h-12 rounded ${event.color}`} />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{event.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                    {new Date(event.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                {event.rsvp_status === 'yes' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {event.rsvp_status === 'no' && <XCircle className="w-4 h-4 text-red-500" />}
                {event.rsvp_status === 'pending' && <HelpCircle className="w-4 h-4 text-yellow-500" />}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and events</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Event</DialogTitle>
            </DialogHeader>
            <CreateEventForm onClose={() => setIsCreateDialogOpen(false)} onEventCreated={fetchCalendarEvents} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2 space-y-4">
          {/* Calendar Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => view === 'month' ? navigateMonth(-1) : navigateWeek(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => view === 'month' ? navigateMonth(1) : navigateWeek(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-bold ml-4">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                </div>
                <Tabs value={view} onValueChange={setView}>
                  <TabsList>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <div>
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {renderUpcomingEvents()}
          {renderActivityHeatmap()}
          
          {/* Calendar Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">My Calendars</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeCalendars.includes('personal')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setActiveCalendars([...activeCalendars, 'personal']);
                    } else {
                      setActiveCalendars(activeCalendars.filter(c => c !== 'personal'));
                    }
                  }}
                  className="w-4 h-4"
                />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Personal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeCalendars.includes('work')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setActiveCalendars([...activeCalendars, 'work']);
                    } else {
                      setActiveCalendars(activeCalendars.filter(c => c !== 'work'));
                    }
                  }}
                  className="w-4 h-4"
                />
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Work</span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedEvent.description && (
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                {new Date(selectedEvent.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                <br />
                {new Date(selectedEvent.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
                {new Date(selectedEvent.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  {selectedEvent.location}
                </div>
              )}
              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  {selectedEvent.participants.join(', ')}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="destructive" className="flex-1" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CreateEventForm({ onClose, onEventCreated }) {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    location: '',
    description: '',
    calendar: 'personal'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create events');
      return;
    }

    setLoading(true);
    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time');
        setLoading(false);
        return;
      }

      const participantsArray = formData.participants
        ? formData.participants.split(',').map(p => p.trim()).filter(p => p)
        : [];

      const colorMap = {
        'meeting': 'bg-blue-500',
        'video': 'bg-purple-500',
        'personal': 'bg-green-500',
        'task': 'bg-orange-500'
      };

      const { error } = await supabase
        .from('calendar_events')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description || null,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            location: formData.location || null,
            event_type: formData.type,
            calendar_type: formData.calendar,
            color: colorMap[formData.type] || 'bg-blue-500',
            participants: participantsArray.length > 0 ? participantsArray : null,
            rsvp_status: 'yes'
          }
        ]);

      if (error) throw error;

      toast.success('Event created successfully!');
      onClose();
      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Meeting with developers"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="video">Video Call</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="calendar">Calendar</Label>
          <Select value={formData.calendar} onValueChange={(value) => setFormData({ ...formData, calendar: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="participants">Participants</Label>
        <Input
          id="participants"
          value={formData.participants}
          onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
          placeholder="Add participants (comma separated)"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Meeting room or video link"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add event details..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Event'
          )}
        </Button>
      </div>
    </form>
  );
}
