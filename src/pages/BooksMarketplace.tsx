import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, BookOpen, Upload, Download, DollarSign, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function BooksMarketplace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [bookType, setBookType] = useState<'pdf' | 'online_access' | 'physical'>('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [pages, setPages] = useState('');

  // Fetch books
  const { data: books = [] } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books_marketplace')
        .select('*, profiles(full_name, username)')
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's books
  const { data: myBooks = [] } = useQuery({
    queryKey: ['my-books'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books_marketplace')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add book mutation
  const addBookMutation = useMutation({
    mutationFn: async (book: any) => {
      const { error } = await supabase
        .from('books_marketplace')
        .insert(book);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
      toast({ title: 'Book added successfully!' });
      resetForm();
    }
  });

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setCourse('');
    setPrice('');
    setDescription('');
    setBookType('pdf');
    setFileUrl('');
    setWebsiteLink('');
    setPages('');
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !subject || !course || !price) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addBookMutation.mutate({
      title,
      subject,
      course,
      price: parseFloat(price),
      description,
      book_type: bookType,
      file_url: fileUrl || null,
      website_link: websiteLink || null,
      pages: pages ? parseInt(pages) : null
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <Button
          onClick={() => navigate('/synq-finance')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to SYNQ Finance
        </Button>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Books Cost-Sharing Marketplace
            </h1>
            <p className="text-lg text-muted-foreground">
              Share and access textbooks at a fraction of the cost
            </p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Get Books
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Give Books
              </TabsTrigger>
            </TabsList>

            {/* Browse Books Tab */}
            <TabsContent value="browse" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Available Books
                  </CardTitle>
                  <CardDescription>
                    Browse and purchase access to digital textbooks from fellow students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {books.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No books available yet. Be the first to upload!
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {books.map((book: any) => (
                        <Card key={book.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{book.title}</CardTitle>
                                <CardDescription>{book.subject} • {book.course}</CardDescription>
                              </div>
                              <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-bold">
                                ${parseFloat(book.price).toFixed(2)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {book.description && (
                              <p className="text-sm text-muted-foreground">{book.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {book.book_type === 'pdf' ? 'PDF' : book.book_type === 'online_access' ? 'Online Access' : 'Physical'}
                              </span>
                              {book.pages && (
                                <span className="text-muted-foreground">{book.pages} pages</span>
                              )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Seller: {book.profiles?.full_name || book.profiles?.username || 'Anonymous'}
                            </div>

                            <Button className="w-full">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Purchase Access
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upload Books Tab */}
            <TabsContent value="upload" className="space-y-6">
              {!showAddForm ? (
                <Card>
                  <CardContent className="py-12 text-center space-y-4">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Upload Your Books</h3>
                      <p className="text-muted-foreground mb-4">
                        Share your textbooks and earn money from students who need them
                      </p>
                      <Button onClick={() => setShowAddForm(true)} size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Book Details</CardTitle>
                    <CardDescription>
                      Fill in the details about your textbook
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Book Title *</Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Calculus: Early Transcendentals"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Mathematics"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="course">Course *</Label>
                          <Input
                            id="course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            placeholder="e.g., MATH 101"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="15.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bookType">Book Type *</Label>
                        <Select value={bookType} onValueChange={(value: any) => setBookType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF File</SelectItem>
                            <SelectItem value="online_access">Online Access / Link</SelectItem>
                            <SelectItem value="physical">Physical Book</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {bookType === 'pdf' && (
                        <div className="space-y-2">
                          <Label htmlFor="fileUrl">File URL (after purchase)</Label>
                          <Input
                            id="fileUrl"
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="Google Drive link or file URL"
                          />
                        </div>
                      )}

                      {bookType === 'online_access' && (
                        <div className="space-y-2">
                          <Label htmlFor="websiteLink">Website/Platform Link</Label>
                          <Input
                            id="websiteLink"
                            value={websiteLink}
                            onChange={(e) => setWebsiteLink(e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="pages">Number of Pages (Optional)</Label>
                        <Input
                          id="pages"
                          type="number"
                          value={pages}
                          onChange={(e) => setPages(e.target.value)}
                          placeholder="850"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Additional details about the book..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={addBookMutation.isPending}>
                          {addBookMutation.isPending ? 'Uploading...' : 'Upload Book'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* My Books */}
              {myBooks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Uploaded Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {myBooks.map((book: any) => (
                        <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{book.title}</h4>
                            <p className="text-sm text-muted-foreground">{book.subject} • {book.course}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-green-500">${parseFloat(book.price).toFixed(2)}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              book.status === 'available' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-gray-500/20 text-gray-500'
                            }`}>
                              {book.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
