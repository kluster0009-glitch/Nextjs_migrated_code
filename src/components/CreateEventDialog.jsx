'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function CreateEventDialog({ onEventCreated }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    maxAttendees: 100,
    imageUrl: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to create events')
      return
    }

    setLoading(true)
    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)

      // Insert event into database
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            event_date: eventDateTime.toISOString(),
            location: formData.location,
            category: formData.category,
            max_attendees: parseInt(formData.maxAttendees),
            organizer_id: user.id,
            image_url: formData.imageUrl || null
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Event created successfully!')
      setOpen(false)
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Technology',
        maxAttendees: 100,
        imageUrl: ''
      })

      // Notify parent component to refresh events
      if (onEventCreated) {
        onEventCreated(data)
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Create New Event
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Tech Talk: AI in Education"
              required
              className="bg-cyber-card/50 border-cyber-border"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what the event is about..."
              required
              rows={4}
              className="bg-cyber-card/50 border-cyber-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="bg-cyber-card/50 border-cyber-border"
              />
            </div>
            <div>
              <Label htmlFor="time">Event Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                required
                className="bg-cyber-card/50 border-cyber-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Auditorium Hall A"
              required
              className="bg-cyber-card/50 border-cyber-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className="bg-cyber-card/50 border-cyber-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maxAttendees">Max Attendees *</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => handleChange('maxAttendees', e.target.value)}
                min="1"
                required
                className="bg-cyber-card/50 border-cyber-border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Event Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-cyber-card/50 border-cyber-border"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-cyber-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-semibold"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
