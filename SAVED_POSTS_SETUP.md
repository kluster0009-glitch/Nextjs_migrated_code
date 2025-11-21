# Saved Posts Feature Setup

## Overview
This document outlines the setup and implementation of the saved posts (bookmark) feature for your Next.js social platform.

## Features Implemented

### 1. **Database Schema**
- **saved_posts table**: Stores user-saved posts with relationships
- **notifications table**: Handles bookmark notifications
- **Triggers & Functions**: Automatic notification creation and counter updates
- **RLS Policies**: Secure row-level access control

### 2. **User Features**
- Click bookmark icon to save/unsave posts
- Visual indication of saved posts (filled bookmark icon)
- Real-time updates via Supabase subscriptions
- Save count tracking on posts

### 3. **Profile Integration**
- New "Saved" tab in profile page
- Display all saved posts
- Easy access to bookmarked content

### 4. **Notification System**
- Post authors receive notifications when their posts are bookmarked
- Notifications include actor information
- No self-notification (users don't get notified for saving their own posts)

## Setup Instructions

### Step 1: Run Database Migration

1. Open your Supabase SQL Editor
2. Navigate to: `supabase_migrations/saved_posts_setup.sql`
3. Copy the entire contents of the file
4. Paste into Supabase SQL Editor
5. Execute the script

This will create:
- `saved_posts` table
- `notifications` table (if not exists)
- Necessary indexes for performance
- RLS policies for security
- Database triggers for auto-updates
- Functions for notification creation

### Step 2: Verify Tables

Check that the following tables exist in your Supabase dashboard:

```sql
-- Verify saved_posts table
SELECT * FROM saved_posts LIMIT 5;

-- Verify notifications table
SELECT * FROM notifications LIMIT 5;

-- Check if saved_count column was added to posts
SELECT id, title, saved_count FROM posts LIMIT 5;
```

### Step 3: Test the Feature

1. **Save a Post**
   - Navigate to the cluster page (`/cluster`)
   - Click the bookmark icon on any post
   - Icon should fill and turn cyan color

2. **Check Notifications**
   - The post author should receive a notification
   - Check in the database: `SELECT * FROM notifications WHERE type = 'post_saved'`

3. **View Saved Posts**
   - Go to your profile page (`/profile`)
   - Click on the "Saved" tab
   - You should see all your bookmarked posts

4. **Unsave a Post**
   - Click the filled bookmark icon again
   - Post should be removed from saved list

### Step 4: Real-time Verification

The feature uses Supabase real-time subscriptions:

1. Open the cluster page in two different browser sessions
2. Save a post in one session
3. The bookmark state should update immediately in both sessions

## File Changes

### Modified Files:

1. **`src/app/(protected)/cluster/page.js`**
   - Added `userSaves` state
   - Implemented `handleSave()` function
   - Added real-time subscription for saved_posts
   - Updated bookmark button with save functionality

2. **`src/app/(protected)/profile/page.js`**
   - Added `savedPosts` state
   - Fetch saved posts from database
   - Added "Saved" tab to profile tabs
   - Display saved posts with empty state

### New Files:

1. **`supabase_migrations/saved_posts_setup.sql`**
   - Complete database schema
   - RLS policies
   - Triggers and functions

## Database Schema Details

### saved_posts Table
```sql
CREATE TABLE saved_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  post_id UUID REFERENCES posts(id),
  created_at TIMESTAMP,
  UNIQUE(user_id, post_id)
);
```

### notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),      -- Recipient
  actor_id UUID REFERENCES auth.users(id),      -- Who performed the action
  type VARCHAR(50),                             -- Notification type
  post_id UUID REFERENCES posts(id),            -- Related post
  message TEXT,                                 -- Notification message
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

### Posts Table Addition
```sql
ALTER TABLE posts ADD COLUMN saved_count INTEGER DEFAULT 0;
```

## Security Features

### Row Level Security (RLS)

1. **saved_posts policies:**
   - Users can only view their own saved posts
   - Users can only save/unsave their own entries

2. **notifications policies:**
   - Users can only view their own notifications
   - Users can mark their own notifications as read
   - System can create notifications for any user

## Troubleshooting

### Issue: Bookmark icon not updating
**Solution:** Check browser console for errors. Ensure Supabase client is properly initialized.

### Issue: Notification not created
**Solution:** 
1. Verify the trigger is created: `SELECT * FROM pg_trigger WHERE tgname = 'on_post_saved'`
2. Check if the function exists: `SELECT * FROM pg_proc WHERE proname = 'create_save_notification'`

### Issue: Saved posts not showing in profile
**Solution:**
1. Check if data exists: `SELECT * FROM saved_posts WHERE user_id = 'YOUR_USER_ID'`
2. Verify RLS policies are correct
3. Check console for fetch errors

### Issue: Real-time updates not working
**Solution:**
1. Enable Realtime in Supabase dashboard for `saved_posts` table
2. Check browser console for subscription errors
3. Verify Supabase client initialization

## API Reference

### Save a Post
```javascript
const { error } = await supabase
  .from('saved_posts')
  .insert({ post_id: postId, user_id: userId });
```

### Unsave a Post
```javascript
const { error } = await supabase
  .from('saved_posts')
  .delete()
  .eq('post_id', postId)
  .eq('user_id', userId);
```

### Fetch Saved Posts
```javascript
const { data, error } = await supabase
  .from('saved_posts')
  .select('post_id, posts(*, profiles(full_name, profile_picture))')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Check if Post is Saved
```javascript
const { data, error } = await supabase
  .from('saved_posts')
  .select('id')
  .eq('post_id', postId)
  .eq('user_id', userId)
  .single();

const isSaved = !!data;
```

## Performance Considerations

1. **Indexes**: Created on `user_id`, `post_id`, and `created_at` for fast queries
2. **Unique Constraint**: Prevents duplicate saves
3. **Cascading Deletes**: Automatic cleanup when posts/users are deleted
4. **Real-time Subscriptions**: Efficient updates without polling

## Future Enhancements

Potential improvements for later:
1. Collections/Folders for organizing saved posts
2. Export saved posts
3. Share saved collections with others
4. Analytics on most-saved posts
5. Bulk unsave functionality
6. Search within saved posts

## Support

If you encounter any issues:
1. Check the Supabase logs
2. Review browser console errors
3. Verify database permissions
4. Check RLS policies

## Testing Checklist

- [ ] Database migration executed successfully
- [ ] saved_posts table created
- [ ] notifications table created
- [ ] Triggers working (test by saving a post)
- [ ] RLS policies active
- [ ] Bookmark icon clickable on cluster page
- [ ] Icon fills when post is saved
- [ ] Icon unfills when post is unsaved
- [ ] Saved posts appear in profile
- [ ] Real-time updates working
- [ ] Notifications created for post authors
- [ ] No self-notifications (own saves)
- [ ] Save count updates correctly

---

**Last Updated:** November 21, 2025
