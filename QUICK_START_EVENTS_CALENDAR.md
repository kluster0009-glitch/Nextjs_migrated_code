# Quick Start Guide - Events & Calendar

## What's Been Implemented

### 1. Database Schema (`supabase_migrations.sql`)
- **events** - Campus events with organizer, category, capacity
- **event_registrations** - Track who registered for which events
- **calendar_events** - Personal calendar entries
- **events_with_stats** view - Events with live attendee counts
- Row Level Security (RLS) policies for data protection

### 2. Events Page (`/events`)
**Features:**
- View all campus events with beautiful cards
- Create new events (CreateEventDialog component)
- Register for events (one-click registration)
- Add events to personal calendar (calendar icon button)
- Filter by: All, Upcoming, Featured, My Events
- Search events by title/description
- Real-time attendee tracking with progress bar
- Event categories with color coding

**New Component:**
- `CreateEventDialog.jsx` - Full-featured event creation form

### 3. Calendar Page (`/calendar`)
**Features:**
- Month/Week/Day view switching
- Create personal calendar events
- View events added from Events page
- Delete calendar events
- Filter by calendar type (Personal/Work)
- Upcoming events sidebar
- Click events to view details/delete

**Updated:**
- Full database integration
- Event CRUD operations
- Real-time data fetching

## Setup Instructions

### Step 1: Run Database Migration

1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `supabase_migrations.sql`
3. Paste and execute
4. Verify tables created: `events`, `event_registrations`, `calendar_events`

### Step 2: Test the Features

**Test Event Creation:**
```
1. Navigate to /events
2. Click "Create Event" button
3. Fill in:
   - Title: "Test Event"
   - Description: "Testing events system"
   - Date: Tomorrow
   - Time: 14:00
   - Location: "Main Hall"
   - Category: Technology
   - Max Attendees: 50
4. Click "Create Event"
5. Event should appear in the list
```

**Test Event Registration:**
```
1. Find your created event
2. Click "Register Now"
3. Button should change to "Registered" with checkmark
4. Attendee count should increase by 1
```

**Test Add to Calendar:**
```
1. Click calendar icon (📅) on any event
2. Toast notification: "Event added to your calendar!"
3. Navigate to /calendar
4. Event should appear on the calendar on the event date
5. Click the event to view details
```

**Test Calendar Event Creation:**
```
1. Navigate to /calendar
2. Click "Create Event"
3. Fill in:
   - Title: "Personal Meeting"
   - Type: Meeting
   - Date: Today
   - Start Time: 10:00
   - End Time: 11:00
   - Calendar: Personal
4. Click "Create Event"
5. Event appears in calendar
```

## User Flow Examples

### Flow 1: User1 Creates Event → User2 Registers & Adds to Calendar
```
User1 Actions:
1. Go to /events
2. Create event "Tech Workshop" for next week
3. Event is now visible to everyone

User2 Actions:
1. Go to /events
2. See "Tech Workshop" in the list
3. Click "Register Now"
4. Click calendar icon to add to personal calendar
5. Go to /calendar to see it scheduled
```

### Flow 2: Personal Calendar Management
```
1. Go to /calendar
2. Switch to Week view to see schedule
3. Create personal event "Study Session"
4. Event appears in calendar
5. Click event → Delete if needed
```

## Key Features Explained

### Event Categories
Events are color-coded by category:
- **Technology** - Cyan
- **Competition** - Purple  
- **Career** - Green
- **Cultural** - Pink
- **Sports** - Orange
- **Academic** - Indigo
- **Workshop** - Yellow
- **Social** - Teal

### Calendar Integration
When adding an event to calendar:
- Automatically creates a 2-hour calendar slot
- Links to original event via `event_id`
- Copies all event details (title, description, location)
- Sets RSVP status to "yes"
- Uses color matching the event category

### Security
- Users can only create/edit/delete their own events
- Users can only register themselves
- Users only see their own calendar entries
- All enforced by RLS policies

## API Structure

### Events API
```javascript
// Create event
supabase.from('events').insert([{ ... }])

// Get all events with stats
supabase.from('events_with_stats').select('*')

// Register for event
supabase.from('event_registrations').insert([{ event_id, user_id }])
```

### Calendar API
```javascript
// Get user's calendar events
supabase.from('calendar_events')
  .select('*')
  .eq('user_id', user.id)

// Create calendar event
supabase.from('calendar_events').insert([{ ... }])

// Delete calendar event
supabase.from('calendar_events')
  .delete()
  .eq('id', eventId)
```

## Troubleshooting

### "Failed to load events"
- Check Supabase connection
- Verify environment variables in `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
  ```

### "You must be logged in"
- Ensure user is authenticated
- Check AuthContext is providing user object

### Events not appearing in calendar
- Verify event was added (check toast notification)
- Check calendar type filter (Personal/Work)
- Ensure date is in visible range

### Can't create events
- Check database tables exist
- Verify RLS policies are enabled
- Check browser console for errors

## File Structure
```
src/
├── app/
│   └── (protected)/
│       ├── events/
│       │   └── page.js          [Updated - Full event management]
│       └── calendar/
│           └── page.js          [Updated - Calendar with DB integration]
├── components/
│   └── CreateEventDialog.jsx   [New - Event creation form]
└── lib/
    └── supabase/
        └── client.js            [Existing - DB client]

supabase_migrations.sql          [New - Database schema]
EVENTS_CALENDAR_SETUP.md         [New - Detailed setup guide]
QUICK_START.md                   [This file - Quick reference]
```

## Next Steps

1. Run the SQL migration ✅
2. Test event creation ✅
3. Test registration ✅
4. Test calendar integration ✅
5. Add real users and enjoy! 🎉

## Feature Highlights

✨ **Smart Capacity Tracking** - Events show fill percentage and become full
✨ **One-Click Calendar Add** - Events instantly added to personal calendar
✨ **Live Updates** - Attendee counts update in real-time
✨ **Beautiful UI** - Cyber-themed design with gradients and animations
✨ **Secure** - RLS policies protect user data
✨ **Responsive** - Works on mobile and desktop
✨ **Search & Filter** - Find events easily
✨ **Multiple Views** - Month/Week/Day calendar views

Enjoy your new Events & Calendar system! 🚀
