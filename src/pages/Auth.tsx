import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';

const signUpSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name contains invalid characters'),
  username: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validated = signUpSchema.parse({
        fullName,
        username,
        email,
        password
      });

      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            username: validated.username,
            full_name: validated.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Ensure profile exists immediately so XP and profile reads work.
      // Note: if the project requires email confirmation, `signUp` may not create a session
      // immediately. Many RLS policies require auth.uid() = id for inserts; attempting to
      // upsert without an active session will fail with a DB/permission error. Only try to
      // upsert when a session is available; otherwise rely on the DB signup trigger or
      // create the profile after the user confirms and signs in.
      const userId = data?.user?.id;
      const sessionAvailable = !!(data?.session ?? (await supabase.auth.getSession()).data?.session);

      if (userId && sessionAvailable) {
        const { error: upsertError } = await supabase.from('profiles').upsert(
          {
            id: userId,
            username: validated.username,
            full_name: validated.fullName,
            xp: 0,
            level: 1,
          },
          { onConflict: 'id' }
        );

        if (upsertError) {
          // Surface DB upsert errors so they are easier to diagnose in dev.
          throw upsertError;
        }
      } else if (userId && !sessionAvailable) {
        // Inform the user that their account was created but email confirmation may be
        // required and the profile will be created after confirmation (or by the DB trigger).
        toast({
          title: 'Account created — confirm your email',
          description:
            'Please check your email to confirm your account. Your profile will be created after confirmation; if you don\'t receive an email, check spam or contact support.',
        });
        // Navigate to home anyway — the app will show a logged-out state until sign-in.
        navigate('/home');
        setLoading(false);
        return;
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Check your email if confirmation is required.",
      });
      // Navigate to home (session will be persisted by the client)
      navigate('/home');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validated = signInSchema.parse({
        email,
        password
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) throw error;

      // Ensure profile exists in case the DB trigger didn't run yet
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id ?? data?.user?.id;
      const sessionAvailable = !!(userData?.user ?? data?.user);

      if (uid && sessionAvailable) {
        const { error: upsertError } = await supabase.from('profiles').upsert({ id: uid }, { onConflict: 'id' });
        if (upsertError) throw upsertError;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });
      navigate('/home');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Welcome to Synq</CardTitle>
          <CardDescription className="text-center">
            Join the student success ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;