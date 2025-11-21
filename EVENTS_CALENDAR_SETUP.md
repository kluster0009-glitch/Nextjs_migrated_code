# Events and Calendar Feature Setup Guide

This guide explains how to set up the Events and Calendar functionality in your application.

## Features

### Events Page (`/events`)
- ✅ View all campus events
- ✅ Create new events with details (title, description, date, time, location, category, max attendees)
- ✅ Register for events
- ✅ Add events to personal calendar
- ✅ Filter events by category (All, Upcoming, Featured, My Events)
- ✅ Search events
- ✅ Real-time attendee count
- ✅ Event capacity tracking

### Calendar Page (`/calendar`)
- ✅ Personal calendar with month/week/day views
- ✅ Create personal calendar events
- ✅ View events added from Events page
- ✅ Multiple calendar types (Personal, Work)
- ✅ Event types (Meeting, Video, Personal, Task)
- ✅ Delete calendar events
- ✅ Upcoming events sidebar
- ✅ Activity heatmap

## Database Setup

### Step 1: Run the SQL Migration

You need to execute the SQL migration in your Supabase project to create the required tables.

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase_migrations.sql`
4. Paste and run the SQL script

This will create:
- `events` table - Stores all campus events
- `event_registrations` table - Tracks which users registered for which events
- `calendar_events` table - Stores personal calendar entries
- Necessary indexes for performance
- Row Level Security (RLS) policies for data protection
- A view `events_with_stats` that includes attendee counts

### Tables Overview

#### `events` Table
```sql
- id (UUID)
- title (TEXT)
- description (TEXT)
- event_date (TIMESTAMPTZ)
- location (TEXT)
- category (TEXT)
- max_attendees (INTEGER)
- organizer_id (UUID) - References auth.users
- image_url (TEXT, optional)
- featured (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)
```

#### `event_registrations` Table
```sql
- id (UUID)
- event_id (UUID) - References events
- user_id (UUID) - References auth.users
- status (TEXT) - 'registered', 'cancelled', 'attended'
- registered_at (TIMESTAMPTZ)
```

#### `calendar_events` Table
```sql
- id (UUID)
- user_id (UUID) - References auth.users
- title (TEXT)
- description (TEXT, optional)
- start_time (TIMESTAMPTZ)
- end_time (TIMESTAMPTZ)
- location (TEXT, optional)
- event_type (TEXT) - 'personal', 'work', 'meeting', 'video', 'task'
- calendar_type (TEXT) - 'personal', 'work'
- color (TEXT)
- participants (TEXT[])
- rsvp_status (TEXT) - 'yes', 'no', 'maybe', 'pending'
- event_id (UUID, optional) - References events if added from Events page
- created_at, updated_at (TIMESTAMPTZ)
```

## How It Works

### Creating an Event

1. User clicks "Create Event" button on `/events` page
2. Fills in event details in the dialog:
   - Title
   - Description
   - Date & Time
   - Location
   - Category (Technology, Competition, Career, Cultural, Sports, Academic, Workshop, Social)
   - Max Attendees
   - Optional: Image URL
3. Event is saved to `events` table with the current user as organizer

### Registering for an Event

1. User clicks "Register Now" on any event card
2. A record is created in `event_registrations` table
3. Button changes to "Registered" with checkmark
4. Attendee count increases automatically

### Adding Event to Calendar

1. User clicks the calendar icon (📅) on any event card
2. Event is automatically added to their personal calendar with:
   - Title and description from the event
   - Start time from event date
   - End time set to 2 hours after start (default)
   - Location from event
   - Reference to original event (event_id)
3. Event becomes visible in `/calendar` page

### Viewing Calendar

1. Users can switch between Month, Week, and Day views
2. Events are color-coded by type
3. Click on any event to view details or delete it
4. Upcoming events shown in sidebar
5. Can filter by calendar type (Personal/Work)

### Creating Personal Calendar Events

1. User clicks "Create Event" on `/calendar` page
2. Fills in event details including:
   - Title
   - Type (Meeting, Video Call, Personal, Task)
   - Date & Time range
   - Optional: Participants, Location, Description
3. Event is saved to `calendar_events` table

## Security (RLS Policies)

The database implements Row Level Security to ensure:

### Events
- Anyone can view events
- Only authenticated users can create events
- Users can only update/delete their own events (as organizer)

### Event Registrations
- Anyone can view registrations (to see attendee counts)
- Users can only register themselves
- Users can only update/cancel their own registrations

### Calendar Events
- Users can only view their own calendar events
- Users can only create/update/delete their own calendar events

## Testing the Feature

1. **Create an Event:**
   - Go to `/events`
   - Click "Create Event"
   - Fill in the form and submit
   - Verify the event appears in the list

2. **Register for Event:**
   - Click "Register Now" on an event
   - Verify button changes to "Registered"
   - Check attendee count increased

3. **Add to Calendar:**
   - Click calendar icon on an event
   - Go to `/calendar`
   - Verify event appears in calendar

4. **Create Calendar Event:**
   - Go to `/calendar`
   - Click "Create Event"
   - Fill in form and submit
   - Verify event appears in calendar view

5. **Delete Calendar Event:**
   - Click on any event in calendar
   - Click "Delete Event"
   - Verify event is removed

## Additional Notes

- The `events_with_stats` view automatically calculates attendee counts
- Events are sorted by date (upcoming first)
- The system prevents duplicate registrations using unique constraints
- Calendar events can be linked to campus events via `event_id` field
- All timestamps are stored in UTC and converted to local time in the UI

## Troubleshooting

### Events not showing up
- Check if you're logged in
- Verify the database tables were created successfully
- Check browser console for any errors

### Can't create events
- Ensure you're authenticated
- Check RLS policies are enabled
- Verify Supabase environment variables are set correctly

### Calendar events missing
- Verify `user_id` matches logged-in user
- Check calendar type filter (Personal/Work)
- Ensure date range includes the events

## Future Enhancements

Potential improvements:
- Email notifications for event reminders
- Event comments/discussion
- Event categories with custom colors
- Recurring events
- Export to Google Calendar/iCal
- Event attendance QR codes
- Event photo galleries
- RSVP maybe/tentative status
- Event waiting list when full
