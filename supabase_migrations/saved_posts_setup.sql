-- Create saved_posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post_id ON saved_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_created_at ON saved_posts(created_at DESC);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved posts" ON saved_posts;
DROP POLICY IF EXISTS "Users can save posts" ON saved_posts;
DROP POLICY IF EXISTS "Users can unsave posts" ON saved_posts;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- RLS Policies for saved_posts
-- Users can view their own saved posts
CREATE POLICY "Users can view their own saved posts"
  ON saved_posts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save posts
CREATE POLICY "Users can save posts"
  ON saved_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave posts
CREATE POLICY "Users can unsave posts"
  ON saved_posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow system to insert notifications (anyone can create notifications for others)
CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Function to create notification when post is saved
CREATE OR REPLACE FUNCTION create_save_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  saver_name TEXT;
BEGIN
  -- Get the post author's ID
  SELECT user_id INTO post_author_id
  FROM posts
  WHERE id = NEW.post_id;
  
  -- Don't create notification if user saves their own post
  IF post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;
  
  -- Get the saver's name
  SELECT full_name INTO saver_name
  FROM profiles
  WHERE id = NEW.user_id;
  
  -- Create notification for post author
  INSERT INTO notifications (user_id, actor_id, type, post_id, message)
  VALUES (
    post_author_id,
    NEW.user_id,
    'post_saved',
    NEW.post_id,
    COALESCE(saver_name, 'Someone') || ' saved your post'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for save notifications
DROP TRIGGER IF EXISTS on_post_saved ON saved_posts;
CREATE TRIGGER on_post_saved
  AFTER INSERT ON saved_posts
  FOR EACH ROW
  EXECUTE FUNCTION create_save_notification();

-- Add saved_count column to posts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'saved_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN saved_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Function to update saved_count
CREATE OR REPLACE FUNCTION update_post_saved_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts 
    SET saved_count = COALESCE(saved_count, 0) + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts 
    SET saved_count = GREATEST(COALESCE(saved_count, 1) - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for saved_count
DROP TRIGGER IF EXISTS on_saved_post_change ON saved_posts;
CREATE TRIGGER on_saved_post_change
  AFTER INSERT OR DELETE ON saved_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_saved_count();

-- Grant necessary permissions
GRANT ALL ON saved_posts TO authenticated;
GRANT ALL ON notifications TO authenticated;

COMMENT ON TABLE saved_posts IS 'Stores user saved/bookmarked posts';
COMMENT ON TABLE notifications IS 'Stores user notifications for various actions';
COMMENT ON COLUMN posts.saved_count IS 'Number of times this post has been saved/bookmarked';
