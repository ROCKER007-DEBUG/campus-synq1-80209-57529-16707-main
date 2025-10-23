import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import synqedLogo from "@/assets/synqed-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1647] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-3xl" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Concentric circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] border border-cyan-500/20 rounded-full animate-pulse" />
        <div className="absolute w-[450px] h-[450px] border border-cyan-500/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-[600px] h-[600px] border border-cyan-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-[750px] h-[750px] border border-cyan-500/5 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={synqedLogo} 
            alt="SYNQED Logo" 
            className="w-24 h-24 animate-scale-in"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6 animate-scale-in">
          SYNQED
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Synchronize Your Academic Journey
        </h2>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Where every assignment, every skill, and every opportunity connects—your journey, your growth, your world.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            onClick={() => navigate('/home')}
            size="lg"
            className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-none shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
          >
            Experience SYNQED
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg font-semibold border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 backdrop-blur-sm"
          >
            Join for Free
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Breathing orb indicator */}
        <div className="pt-12 flex justify-center">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
