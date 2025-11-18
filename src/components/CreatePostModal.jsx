import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, X, Smile, MapPin, BarChart3, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  'General',
  'Academic',
  'College',
  'Events',
  'Opportunities',
  'Campus Life',
  'Study Groups',
  'Announcements',
];

export function CreatePostModal({ open, onOpenChange, onPostCreated }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const getUserInitials = () => {
    const name = user?.profile?.full_name || user?.email || '';
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      handleFiles(imageFiles);
    }
  }, []);

  const handleFiles = (files) => {
    const newImages = files.slice(0, 4 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }

    setLoading(true);

    try {
      // Create post without images first (skip image upload)
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            title: content.trim().substring(0, 100),
            content: content.trim(),
            category: 'General',
            image_url: null,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Cleanup
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setContent('');
      setImages([]);
      
      toast.success('Post created successfully! 🎉');
      
      if (onPostCreated) {
        onPostCreated(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(`Failed to create post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setContent('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        {/* Custom Overlay */}
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        
        {/* Custom Content */}
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-[600px] translate-x-[-50%] translate-y-[-50%] bg-black shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl overflow-hidden"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-[#1d9bf0]/10 border-4 border-dashed border-[#1d9bf0] rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-[#1d9bf0]" />
                <p className="text-xl font-semibold text-[#1d9bf0]">Drop your images here</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <DialogPrimitive.Close className="rounded-full p-2 hover:bg-white/10 transition-colors">
              <X className="h-5 w-5 text-white" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 font-bold rounded-full px-4 h-9"
                disabled
              >
                Drafts
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full px-6 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <form onSubmit={handleSubmit} className="px-4 pb-4">
            <div className="flex gap-3">
              {/* Avatar */}
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={user?.profile?.profile_picture} />
                <AvatarFallback className="bg-gray-700 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>

              {/* Content Area */}
              <div className="flex-1 min-w-0">
                {/* Textarea */}
                <Textarea
                  ref={textareaRef}
                  placeholder="What's happening?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  className="min-h-[120px] text-xl border-0 bg-transparent p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-white"
                  autoFocus
                />

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className={cn(
                    "mt-3 rounded-2xl overflow-hidden border border-gray-700",
                    images.length === 1 && "grid grid-cols-1",
                    images.length === 2 && "grid grid-cols-2 gap-0.5",
                    images.length === 3 && "grid grid-cols-2 gap-0.5",
                    images.length === 4 && "grid grid-cols-2 gap-0.5"
                  )}>
                    {images.map((image, index) => (
                      <div 
                        key={image.id} 
                        className={cn(
                          "relative group bg-gray-900",
                          images.length === 3 && index === 0 && "col-span-2"
                        )}
                      >
                        <img
                          src={image.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover aspect-video"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/75 hover:bg-black/90 text-white"
                          onClick={() => removeImage(image.id)}
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply visibility */}
                <div className="flex items-center gap-1 text-[#1d9bf0] text-[15px] font-semibold mt-4 mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>Everyone can reply</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-700 mb-3" />

                {/* Bottom toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center -ml-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading || images.length >= 4}
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      disabled={loading || images.length >= 4}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full"
                      disabled
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full"
                      disabled
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full"
                      disabled
                    >
                      <Calendar className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full"
                      disabled
                    >
                      <MapPin className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}