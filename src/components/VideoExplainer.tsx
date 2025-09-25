import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function VideoExplainer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Using Cloudinary CDN for optimized video delivery
  // Free tier: 25GB bandwidth/month, automatic format optimization
  const videoUrl = "https://res.cloudinary.com/dgn2us1vh/video/upload/v1756674992/challenges-bitcamp-optimized_ypzjsy.mp4";
  
  // Fallback to local video if CDN fails
  const baseUrl = import.meta.env.BASE_URL;
  const localVideoUrl = `${baseUrl}challenges-bitcamp.mp4`;
  const thumbnailUrl = `${baseUrl}bitcamp-challenges-thumbnail.jpg`;
  
  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsLoading(true);
    
    // Preload video metadata
    if (videoRef.current) {
      videoRef.current.load();
    }
  };
  
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      // Monitor loading progress
      const video = videoRef.current;
      
      const handleProgress = () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const duration = video.duration;
          if (duration > 0) {
            setLoadProgress((bufferedEnd / duration) * 100);
          }
        }
      };
      
      const handleCanPlay = () => {
        setIsLoading(false);
        video.play();
      };
      
      const handleError = () => {
        // Fallback to local video on CDN error
        console.log("CDN failed, falling back to local video");
        video.src = localVideoUrl;
      };
      
      video.addEventListener('progress', handleProgress);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isPlaying, localVideoUrl]);

  return (
    <section className="py-20 bg-gradient-to-b from-surface to-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">3 წუთი რომელიც შეცვლის შენს კარიერას</span>
          </div>
          
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            რატომ ჩელენჯები და არა კურსები?
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            მოისმინე პირადად ჩემგან, როგორ მუშაობს ჩვენი სისტემა და რატომ არის ეს ერთადერთი გზა რეალური ტრანსფორმაციისთვის
          </p>
        </div>

        <Card className="relative overflow-hidden shadow-2xl border-secondary/20 bg-surface">
          <div className="relative aspect-video">
            {!isPlaying ? (
              <>
                {/* Video Thumbnail Background */}
                <img 
                  src={thumbnailUrl}
                  alt="BitCamp Challenges Program"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay and Play Button */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent cursor-pointer"
                  onClick={handlePlayClick}
                >
                  {/* Play button positioned in top left corner */}
                  <div className="absolute top-8 left-8">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-secondary/40 rounded-full animate-pulse"></div>
                      <div className="relative z-10 rounded-full w-16 h-16 bg-secondary hover:bg-secondary/90 shadow-xl transition-transform hover:scale-110 flex items-center justify-center">
                        <Play className="w-6 h-6 ml-1 text-white" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 px-3 py-1 bg-destructive text-destructive-foreground text-sm font-semibold rounded-md animate-pulse">
                    ნახე ახლავე
                  </div>
                  
                  <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-background/90 backdrop-blur rounded-md">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">აიყვანე პირადი მენტორი</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-background/90 backdrop-blur rounded-md">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">ყოველდღიური მხარდაჭერა</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                    <Loader2 className="w-12 h-12 text-secondary animate-spin mb-4" />
                    <p className="text-white text-sm mb-2">ვიდეო იტვირთება...</p>
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary transition-all duration-300"
                        style={{ width: `${loadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  poster={thumbnailUrl}
                  src={videoUrl}
                  preload="metadata"
                  onEnded={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
              </>
            )}
          </div>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-2">97%</div>
            <p className="text-text-secondary">ამთავრებს პირველ ჩელენჯს</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="text-3xl font-bold text-primary mb-2">21-100</div>
            <p className="text-text-secondary">დღე ტრანსფორმაციისთვის</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <div className="text-3xl font-bold text-accent mb-2">ყოველდღიური</div>
            <p className="text-text-secondary">მენტორის მხარდაჭერა</p>
          </Card>
        </div>

        <div className="mt-10 text-center px-4">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 shadow-xl w-full sm:w-auto max-w-md"
            onClick={() => {
              console.log('VideoExplainer button clicked!'); // Debug log
              const targetElement = document.getElementById('pricing');
              
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              } else {
                console.log('Pricing element not found in VideoExplainer');
              }
            }}
          >
            დაიწყე შენი ტრანსფორმაცია ახლავე
          </Button>
          <p className="mt-4 text-sm text-text-secondary">
            ⚡ ადგილები შეზღუდულია • სექტემბრის ნაკადზე მიღება მალე დასრულდება
          </p>
        </div>
      </div>
    </section>
  );
}