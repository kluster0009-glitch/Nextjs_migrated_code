# ⚡ QUICK SETUP - Events & Calendar

## Step-by-Step Setup (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### Step 2: Run Database Migration
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"+ New Query"**
3. Open the file `supabase_migrations.sql` in this project
4. Copy **ALL** the SQL code (from the first line to the last)
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** or press `Ctrl/Cmd + Enter`
7. Wait for success message: "Success. No rows returned"

### Step 3: Verify Tables Created
1. Click on **"Table Editor"** in the left sidebar
2. You should see these new tables:
   - ✅ `events`
   - ✅ `event_registrations`
   - ✅ `calendar_events`
3. Click on each table to verify they have columns

### Step 4: Test the Application
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/events`

3. **Test Event Creation:**
   - Click "Create Event" button
   - Fill in the form:
     ```
     Title: Test Workshop
     Description: Testing the events system
     Date: [Select tomorrow's date]
     Time: 14:00
     Location: Main Hall
     Category: Technology
     Max Attendees: 50
     ```
   - Click "Create Event"
   - ✅ You should see a success toast
   - ✅ Event should appear in the list

4. **Test Event Registration:**
   - Find your "Test Workshop" event
   - Click "Register Now"
   - ✅ Button should change to "Registered" with checkmark
   - ✅ Attendee count should show "1 / 50 attendees"

5. **Test Add to Calendar:**
   - Click the calendar icon (📅) on your event
   - ✅ Toast: "Event added to your calendar!"
   - Navigate to `http://localhost:3000/calendar`
   - ✅ Event should appear on tomorrow's date

6. **Test Personal Calendar Event:**
   - On `/calendar`, click "Create Event"
   - Fill in:
     ```
     Title: Team Meeting
     Type: Meeting
     Date: [Today's date]
     Start Time: 10:00
     End Time: 11:00
     Calendar: Personal
     ```
   - Click "Create Event"
   - ✅ Event should appear in calendar

### Step 5: Done! 🎉

Your Events and Calendar system is now fully functional!

---

## Common Issues & Fixes

### Issue: Tables not created
**Solution:**
- Make sure you copied the ENTIRE SQL file
- Check for any error messages in Supabase
- Try running the migration again

### Issue: "Failed to load events"
**Solution:**
- Check your `.env.local` file has:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
- Restart your development server

### Issue: "You must be logged in"
**Solution:**
- Make sure you're logged in to the app
- Check that authentication is working
- Try logging out and back in

### Issue: Events not showing in calendar
**Solution:**
- Click the calendar icon again (might have failed)
- Check the "Personal" calendar is toggled on
- Verify the event date is within the visible calendar range

---

## What You Can Do Now

### As Event Organizer:
1. Create campus events
2. Set capacity limits
3. Track registrations
4. Mark events as featured

### As Student/User:
1. Browse all campus events
2. Search for specific events
3. Register for events
4. Add events to personal calendar
5. Create personal calendar entries
6. Manage your schedule

---

## Quick Reference

### Event Categories
- Technology (Cyan)
- Competition (Purple)
- Career (Green)
- Cultural (Pink)
- Sports (Orange)
- Academic (Indigo)
- Workshop (Yellow)
- Social (Teal)

### Calendar Types
- Personal (Green)
- Work (Blue)

### Event Types
- Meeting
- Video Call
- Personal
- Task

---

## Next Steps

1. ✅ Create some real events
2. ✅ Invite team members to register
3. ✅ Start using the calendar
4. ✅ Customize categories if needed
5. ✅ Add event images (optional)

---

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase tables exist
3. Check RLS policies are enabled
4. See `EVENTS_CALENDAR_SETUP.md` for detailed troubleshooting

---

**Estimated Setup Time:** 5 minutes  
**Difficulty:** Easy  
**Prerequisites:** Supabase account, Next.js app running

🚀 Enjoy your new Events & Calendar system!
