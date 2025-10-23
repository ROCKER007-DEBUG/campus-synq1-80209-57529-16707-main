import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Brain } from 'lucide-react';

interface AptitudeTestNotificationProps {
  onTakeTest: () => void;
}

const AptitudeTestNotification = ({ onTakeTest }: AptitudeTestNotificationProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const showNotification = () => {
      toast({
        title: "Discover Your Career Path! 🎯",
        description: "Take our aptitude test to find the perfect career for you.",
        duration: 8000,
      });
    };

    // Show initial notification after 2 minutes
    const initialTimer = setTimeout(showNotification, 120000);

    // Show recurring notifications every 2 minutes after the first one
    const recurringInterval = setInterval(showNotification, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(recurringInterval);
    };
  }, [toast, onTakeTest]);

  return null;
};

export default AptitudeTestNotification;
