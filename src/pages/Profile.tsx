import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({ name: '', type: 'offer', description: '' });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfile(user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData);

      // Load skills
      const { data: skillsData } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId);

      setSkills(skillsData || []);

      // Load badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);

      setBadges(badgesData || []);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name || !profile) return;

    try {
      const { error } = await supabase
        .from('user_skills')
        .insert({
          user_id: profile.id,
          skill_name: newSkill.name,
          skill_type: newSkill.type,
          description: newSkill.description,
        });

      if (error) throw error;

      toast({
        title: "Skill added!",
        description: "Your skill has been added to your profile.",
      });

      setNewSkill({ name: '', type: 'offer', description: '' });
      loadProfile(profile.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      toast({
        title: "Skill removed",
        description: "Skill has been removed from your profile.",
      });

      loadProfile(profile.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const offeredSkills = skills.filter(s => s.skill_type === 'offer');
  const neededSkills = skills.filter(s => s.skill_type === 'need');

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-lg">{profile?.full_name}</p>
              <p className="text-muted-foreground">@{profile?.username}</p>
            </div>
            {profile?.bio && <p>{profile.bio}</p>}
          </CardContent>
        </Card>

        {/* Badges */}
        {badges.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge.id} className="bg-gradient-primary">
                    {badge.badge_name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Offered */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>What I Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {offeredSkills.map((skill) => (
                <Badge key={skill.id} className="bg-green-500 text-white flex items-center gap-1">
                  {skill.skill_name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill.id)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Needed */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>What I Need</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {neededSkills.map((skill) => (
                <Badge key={skill.id} className="bg-blue-500 text-white flex items-center gap-1">
                  {skill.skill_name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill.id)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Skill */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add Skill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Skill name (e.g., Python, Essay Writing)"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
            />
            <div className="flex gap-2">
              <Button
                variant={newSkill.type === 'offer' ? 'default' : 'outline'}
                onClick={() => setNewSkill({ ...newSkill, type: 'offer' })}
              >
                I Offer This
              </Button>
              <Button
                variant={newSkill.type === 'need' ? 'default' : 'outline'}
                onClick={() => setNewSkill({ ...newSkill, type: 'need' })}
              >
                I Need This
              </Button>
            </div>
            <Button onClick={addSkill} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;