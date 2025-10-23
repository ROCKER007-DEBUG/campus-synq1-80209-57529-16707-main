import { useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useXP, XP_ACTIONS } from '@/hooks/useXP';
import { useToast } from '@/hooks/use-toast';

interface SimuLearnProps {
  onBack: () => void;
}

const SimuLearn = ({ onBack }: SimuLearnProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // in seconds
  const { addXP } = useXP();
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  const xpIntervalRef = useRef<number>(0);

  useEffect(() => {
    // Start tracking time
    timerRef.current = window.setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        xpIntervalRef.current = newTime;
        
        // Award 10 XP every 2 minutes (120 seconds)
        if (newTime % 120 === 0) {
          addXP(10, 'Learning on SimuLearn for 2 minutes!');
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [addXP]);

  const handleBack = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    
    // Show summary toast
    const minutes = Math.floor(timeSpent / 60);
    const xpEarned = Math.floor(timeSpent / 120) * 10;
    
    toast({
      title: '🎓 SimuLearn Session Complete!',
      description: `Time spent: ${minutes} min | XP earned: ${xpEarned}`,
    });
    
    onBack();
  };

  const handleRedirectToOriginal = () => {
    setShowExitDialog(false);
    window.open('https://simulearn.lovable.app/', '_blank');
    
    // Show summary toast
    const minutes = Math.floor(timeSpent / 60);
    const xpEarned = Math.floor(timeSpent / 120) * 10;
    
    toast({
      title: '🎓 Redirecting to SimuLearn',
      description: `Time spent: ${minutes} min | XP earned: ${xpEarned}`,
    });
    
    onBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="relative h-screen w-full flex flex-col">
        {/* Header with timer and back button */}
        <div className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Time: <span className="font-mono font-bold text-foreground">{formatTime(timeSpent)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              XP Earned: <span className="font-bold text-primary">{Math.floor(timeSpent / 120) * 10}</span>
            </div>
          </div>
        </div>

        {/* SimuLearn iframe */}
        <iframe
          src="https://simulearn.lovable.app/"
          className="flex-1 w-full border-0"
          title="SimuLearn"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave SimuLearn?</AlertDialogTitle>
            <AlertDialogDescription>
              You've spent {Math.floor(timeSpent / 60)} minutes learning and earned {Math.floor(timeSpent / 120) * 10} XP!
              <br /><br />
              Would you like to open SimuLearn in a new tab to continue, or return to the home page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
              Stay Here
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit}>
              Return Home
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={handleRedirectToOriginal}
              className="bg-primary hover:bg-primary/90"
            >
              Open in New Tab
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SimuLearn;
