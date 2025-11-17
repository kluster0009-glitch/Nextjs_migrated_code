import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';

// Function to load Google Fonts dynamically
const loadGoogleFont = (fontFamily) => {
  if (!fontFamily || fontFamily === 'Inter') return; // Inter is already loaded
  
  const fontId = `font-${fontFamily.replace(/\s+/g, '-')}`;
  if (document.getElementById(fontId)) return; // Already loaded
  
  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
};

const NoticeCarousel = () => {
  const [api, setApi] = useState();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notices from database
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabase
          .from('carousel_slides')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          const typedNotices = data;
          setNotices(typedNotices);
          
          // Load Google Fonts for all notices
          typedNotices.forEach(notice => {
            if (notice.heading_font_family) loadGoogleFont(notice.heading_font_family);
            if (notice.message_font_family) loadGoogleFont(notice.message_font_family);
          });
        }
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!api || notices.length === 0) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [api, notices.length]);

  // Don't render carousel if there are no notices
  if (loading || notices.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-6 py-4">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {notices.map((notice) => {
            const hasContent = notice.image_url || notice.heading;
            
            // Don't render if no image or heading
            if (!hasContent) return null;
            
            const headingStyle = {
              color: notice.heading_color || '#ffffff',
              fontFamily: notice.heading_font_family || 'Inter',
              fontSize: notice.heading_font_size || '2xl',
            };
            
            const messageStyle = {
              color: notice.message_color || '#ffffff',
              fontFamily: notice.message_font_family || 'Inter',
              fontSize: notice.message_font_size || 'base',
            };
            
            const CardContent = (
              <Card
                className="relative overflow-hidden min-h-[300px] bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
              >
                {/* Background Image with 16:9 aspect ratio */}
                {notice.image_url && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${notice.image_url})`,
                      aspectRatio: '16/9'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  </div>
                )}
                
                {/* Content Overlay */}
                <div className="relative z-10 p-6 flex flex-col justify-end min-h-[300px]">
                  <div className="space-y-3">
                    {/* Heading */}
                    {notice.heading && (
                      <h3 
                        className="text-2xl md:text-3xl font-bold"
                        style={{
                          color: headingStyle.color,
                          fontFamily: headingStyle.fontFamily,
                        }}
                      >
                        {notice.heading}
                      </h3>
                    )}
                    
                    {/* Message */}
                    <p 
                      className="leading-relaxed"
                      style={{
                        color: messageStyle.color,
                        fontFamily: messageStyle.fontFamily,
                      }}
                    >
                      {notice.message}
                    </p>
                  </div>
                </div>
              </Card>
            );
            
            return (
              <CarouselItem key={notice.id}>
                {notice.button_link ? (
                  <div 
                    onClick={() => window.open(notice.button_link, '_blank')}
                    className="cursor-pointer"
                  >
                    {CardContent}
                  </div>
                ) : (
                  CardContent
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4 bg-cyber-card/80 border-cyber-border hover:bg-cyber-card hover:border-neon-cyan/50 text-foreground" />
        <CarouselNext className="hidden sm:flex -right-4 bg-cyber-card/80 border-cyber-border hover:bg-cyber-card hover:border-neon-cyan/50 text-foreground" />
      </Carousel>
    </div>
  );
};

export default NoticeCarousel;
