# Multi-Media Posts Guide 📸🎥

## Overview
Your Kluster app now supports **Instagram-style multi-media posts**! Users can upload up to 10 images and videos per post, with a beautiful carousel display.

## Features

### 🎨 Multi-Media Upload
- **Upload Multiple Files**: Add up to 10 images/videos per post
- **Mixed Media**: Combine images and videos in a single post
- **Real-time Progress**: Individual progress bars for each file
- **Grid Preview**: See all your uploads in a 2-column grid
- **Easy Management**: Remove individual files before posting
- **File Validation**: Automatic size and type checking

### 📱 Instagram-Style Display
- **Carousel Navigation**: Swipe or use arrow buttons
- **Dot Indicators**: See your position in the carousel
- **Counter Badge**: Shows current position (e.g., "1/5")
- **Responsive**: Works on mobile and desktop
- **Video Support**: Inline video playback with controls

### 🔒 File Restrictions
**Images:**
- Max size: 5MB per image
- Formats: JPG, JPEG, PNG, GIF, WebP, SVG

**Videos:**
- Max size: 100MB per video
- Formats: MP4, WebM, OGG

## How to Use

### Creating a Multi-Media Post

1. **Open Create Post Modal**
   - Click the "Create Post" button in the sidebar
   - Or use the quick action button in the cluster feed

2. **Add Media Files**
   - Click the image icon (📷) in the post composer
   - The multi-media uploader will appear
   - Click "Add Images/Videos" to select files
   - Or drag & drop files into the upload area

3. **Upload Progress**
   - Each file shows its own upload progress
   - You can see percentage complete for each file
   - Files are uploaded to ImageKit CDN automatically

4. **Manage Your Uploads**
   - Remove any file by clicking the "Remove" button
   - Add more files with the "+ Add More" button
   - Maximum 10 files total per post

5. **Publish Your Post**
   - Write your post content
   - Select a category
   - Click "Post" to publish
   - Your media carousel will appear in the feed!

### Viewing Multi-Media Posts

#### In the Cluster Feed
- Posts with multiple media show a carousel
- Navigate using:
  - **Arrow buttons**: Click left/right arrows
  - **Swipe**: Swipe left/right on mobile
  - **Dots**: Click any dot to jump to that image
- Counter badge shows position (e.g., "2/5")

#### On Profile Pages
- Same carousel display for all posts
- Works in all tabs: Your Posts, Liked, Saved, Commented

#### Backward Compatibility
- Old posts with single images still display normally
- No data migration needed for existing posts
- New `media` field coexists with legacy `image_url`

## Database Schema

### Posts Table Structure
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  category TEXT,
  user_id UUID,
  image_url TEXT,                    -- Legacy single image (still supported)
  media JSONB DEFAULT '[]'::jsonb,   -- New media array
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saved_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Index for fast media queries
CREATE INDEX idx_posts_media ON posts USING gin (media);
```

### Media Object Structure
Each item in the `media` array:
```json
{
  "url": "https://ik.imagekit.io/kluster/posts/abc123.jpg",
  "type": "image",           // or "video"
  "fileId": "abc123",        // ImageKit file ID for deletion
  "width": 1920,             // Optional
  "height": 1080            // Optional
}
```

## Component Architecture

### MultiMediaUploader Component
**Location**: `/src/components/MultiMediaUploader.jsx`

**Props:**
```jsx
<MultiMediaUploader
  onMediaChange={(media) => setMediaFiles(media)}  // Callback with uploaded files
  maxFiles={10}                                     // Max number of files
  folder="posts"                                    // ImageKit folder
  acceptImages={true}                               // Allow images
  acceptVideos={true}                               // Allow videos
/>
```

**Features:**
- Grid layout with 2 columns
- Individual upload progress per file
- Remove functionality for each file
- "Add More" button when under max files
- Automatic file validation

### MediaCarousel Component
**Location**: `/src/components/MediaCarousel.jsx`

**Props:**
```jsx
<MediaCarousel
  media={[                                          // Array of media objects
    { url: "...", type: "image" },
    { url: "...", type: "video" }
  ]}
/>
```

**Features:**
- embla-carousel-react for smooth navigation
- Previous/Next arrow buttons
- Dot navigation indicators
- Counter badge (1/5 format)
- Supports both images and videos
- Responsive design

## ImageKit Integration

### Configuration
ImageKit credentials are set in `.env.local`:
```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kluster
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### Upload Process
1. User selects files
2. MultiMediaUploader validates each file
3. Files upload to ImageKit with progress tracking
4. ImageKit returns CDN URLs
5. Media array saves to database on post creation

### Optimization
- Automatic image optimization via ImageKit
- CDN delivery for fast loading
- Lazy loading in carousel
- Video streaming support

## API Routes

### ImageKit Authentication
**Endpoint**: `/api/imagekit/auth/route.js`
- Generates upload signatures
- Required for secure uploads
- Called automatically by uploader

### ImageKit Delete
**Endpoint**: `/api/imagekit/delete/route.js`
- Deletes files from ImageKit
- Used when removing media
- Prevents orphaned files

## Testing Checklist

✅ **Upload Flow:**
- [ ] Upload single image
- [ ] Upload multiple images (2-10)
- [ ] Upload single video
- [ ] Upload mixed media (images + videos)
- [ ] Remove individual files
- [ ] Add more after initial upload
- [ ] Test file size limits
- [ ] Test unsupported file types

✅ **Display:**
- [ ] Carousel shows all media
- [ ] Arrow navigation works
- [ ] Dot navigation works
- [ ] Counter shows correct position
- [ ] Videos play correctly
- [ ] Responsive on mobile
- [ ] Backward compatible with old posts

✅ **Performance:**
- [ ] Upload progress accurate
- [ ] Images load quickly
- [ ] Carousel smooth on mobile
- [ ] No memory leaks on large uploads

## Troubleshooting

### Upload Fails
- Check file size (Images: 5MB, Videos: 100MB)
- Verify file format is supported
- Check ImageKit credentials in `.env.local`
- Check browser console for errors

### Carousel Not Showing
- Verify `media` field has data in database
- Check component import in page file
- Verify `embla-carousel-react` is installed
- Check browser console for errors

### Progress Bar Stuck
- Large videos take longer to upload
- Check network connection
- Verify ImageKit API is accessible
- Try smaller file sizes first

### Old Posts Not Displaying
- Backward compatibility is built-in
- Posts with `image_url` still work
- No migration needed
- Check conditional rendering logic

## Future Enhancements

### Potential Features
- [ ] Reorder media in carousel
- [ ] Add captions to individual media
- [ ] Video thumbnail generation
- [ ] Image filters/editing
- [ ] Batch upload with drag & drop
- [ ] Progress notification in sidebar
- [ ] Media compression before upload
- [ ] GIF support and playback
- [ ] Album-style grouping

### Performance Optimizations
- [ ] Lazy load carousel images
- [ ] Preload next/previous images
- [ ] Video thumbnail caching
- [ ] Progressive image loading
- [ ] Service worker for offline viewing

## Support

For issues or questions:
1. Check browser console for errors
2. Verify ImageKit dashboard for uploads
3. Check Supabase database for media field
4. Review network tab for API calls
5. Check IMAGEKIT_SETUP.md for configuration

---

**Ready to create amazing multi-media posts! 🚀**
