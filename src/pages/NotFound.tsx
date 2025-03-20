
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Set animation state
    setIsLoaded(true);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className={cn(
          "mb-6 relative",
          isLoaded && "animate-fade-in"
        )}>
          <div className="text-9xl font-display font-bold text-museum-200 dark:text-museum-800">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-20 w-20 text-accent-700 dark:text-accent-400" />
          </div>
        </div>
        
        <h1 className={cn(
          "text-2xl md:text-3xl font-display font-bold text-museum-900 dark:text-white mb-4",
          isLoaded && "animate-fade-in"
        )}
          style={{ animationDelay: '200ms' }}
        >
          Page Not Found
        </h1>
        
        <p className={cn(
          "text-museum-600 dark:text-museum-300 mb-8 max-w-sm mx-auto",
          isLoaded && "animate-fade-in"
        )}
          style={{ animationDelay: '400ms' }}
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-4",
          isLoaded && "animate-fade-in"
        )}
          style={{ animationDelay: '600ms' }}
        >
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full bg-accent-700 hover:bg-accent-800 text-white">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
