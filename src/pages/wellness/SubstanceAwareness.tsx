import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Phone, AlertCircle } from 'lucide-react';

export default function SubstanceAwareness() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[hsl(var(--neon-cyan))]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--neon-purple))]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/wellness')}
          className="mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wellness
        </Button>

        <div className="mb-12 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-purple))] bg-clip-text text-transparent">
            Substance Awareness
          </h1>
          <p className="text-xl text-muted-foreground">
            Resources and support for healthy choices
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-[hsl(var(--neon-cyan))]/30 shadow-lg shadow-[hsl(var(--neon-cyan))]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[hsl(var(--neon-cyan))]" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Understanding the impacts of substance use is crucial for your health and academic success.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-cyan))]">•</span>
                  <span>Learn about risks and effects of various substances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-cyan))]">•</span>
                  <span>Access confidential support resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--neon-cyan))]">•</span>
                  <span>Connect with campus health services</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-[hsl(var(--neon-purple))]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[hsl(var(--neon-purple))]" />
                Get Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-purple))]/20">
                  <p className="font-semibold mb-1">Campus Health Services</p>
                  <p className="text-sm text-muted-foreground">Available 24/7 for students</p>
                  <Button variant="outline" className="mt-3 w-full">Contact Support</Button>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-[hsl(var(--neon-cyan))]/20">
                  <p className="font-semibold mb-1">Anonymous Hotline</p>
                  <p className="text-sm text-muted-foreground">1-800-XXX-XXXX</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
