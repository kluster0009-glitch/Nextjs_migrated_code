# Quick Setup Guide - Saved Posts Feature

## 🚀 Quick Start (5 minutes)

### Step 1: Run Database Migration (2 minutes)
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor
3. Copy contents from `supabase_migrations/saved_posts_setup.sql`
4. Paste and Run ✅

### Step 2: Enable Realtime (1 minute)
1. In Supabase Dashboard → Database → Replication
2. Find `saved_posts` table
3. Toggle Realtime to ON ✅

### Step 3: Test (2 minutes)
1. Start your dev server: `npm run dev`
2. Go to `/cluster` page
3. Click bookmark icon on any post 🔖
4. Check `/profile` → "Saved" tab
5. Your saved post should appear! ✨

## ✨ What You Get

### User Features
- 🔖 Click bookmark icon to save posts
- 📱 Real-time updates across all devices
- 👤 View all saved posts in profile
- 🔔 Authors get notified when posts are saved

### Technical Features
- ⚡ Real-time Supabase subscriptions
- 🔒 Secure RLS policies
- 📊 Automatic save counter
- 🔔 Auto-notification system
- 🎯 Optimized indexes for performance

## 📋 Database Tables Created

1. **saved_posts** - Stores bookmarks
2. **notifications** - Handles all notifications
3. **posts.saved_count** - Counter column added

## 🎨 UI Components Updated

1. **Cluster Page** (`/cluster`)
   - Bookmark button now functional
   - Fills cyan when saved
   - Real-time sync

2. **Profile Page** (`/profile`)
   - New "Saved" tab added
   - Shows all bookmarked posts
   - Empty state with icon

## 🧪 Testing Checklist

```bash
# Test Save
✅ Click bookmark on post
✅ Icon turns cyan and fills
✅ Check profile → Saved tab
✅ Post appears in saved list

# Test Unsave
✅ Click filled bookmark
✅ Icon unfills
✅ Post removed from saved list

# Test Notifications
✅ Save someone else's post
✅ They get notification
✅ Check: SELECT * FROM notifications;

# Test Real-time
✅ Open in 2 browser tabs
✅ Save post in tab 1
✅ Bookmark updates in tab 2
```

## 🐛 Quick Fixes

### Bookmark not working?
```sql
-- Check if table exists
SELECT * FROM saved_posts LIMIT 1;
```

### Notifications not showing?
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_post_saved';
```

### Real-time not working?
1. Enable Realtime in Supabase Dashboard
2. Table: `saved_posts` → Replication → ON

## 📚 Files Modified

```
✅ src/app/(protected)/cluster/page.js
✅ src/app/(protected)/profile/page.js
📁 supabase_migrations/saved_posts_setup.sql (NEW)
📄 SAVED_POSTS_SETUP.md (NEW)
```

## 🎯 Next Steps

1. Run the migration ✅
2. Test the feature ✅
3. Customize notifications (optional)
4. Add notification bell icon (coming next!)

## 💡 Pro Tips

- Saved posts are private (only you can see)
- No duplicate saves (enforced at DB level)
- Automatic cleanup on post/user deletion
- Real-time updates = no page refresh needed

## 🆘 Need Help?

1. Check `SAVED_POSTS_SETUP.md` for detailed docs
2. Review browser console for errors
3. Check Supabase logs
4. Verify RLS policies are enabled

---

**Ready to test?** Run the migration and start bookmarking! 🚀
