
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { addNarrativeThread } from '@/lib/firebase/narrative';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function QuickPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, campaign, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('Loading...');

  const handleSubmit = useCallback(async () => {
    if (!user || !campaign || !title || !content) {
      if(user && campaign && (!title || !content)) {
          setStatus("Error: Title and content are required.");
          toast({ variant: "destructive", title: "Missing Fields", description: "Please provide both a title and content for the post." });
      }
      return;
    }

    setIsSubmitting(true);
    setStatus('Submitting...');
    
    try {
      const newThreadData = {
        campaignId: campaign.id,
        authorId: user.id,
        title,
        content,
        createdAt: Date.now(),
      };

      await addNarrativeThread(newThreadData);

      toast({ title: "Post Created!", description: "The new narrative thread has been added." });
      setStatus('Redirecting...');
      router.push('/dashboard/narrative');
    } catch (error) {
      console.error("Error creating narrative thread:", error);
      toast({ variant: "destructive", title: "Submission Failed", description: "Could not create the new post." });
      setStatus('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  }, [user, campaign, title, content, router, toast]);

  useEffect(() => {
    if (isAuthLoading) {
      setStatus('Authenticating...');
      return;
    }
    
    if (!user || !campaign) {
      setStatus('You must be logged in to a campaign to use this feature.');
      // Optional: Redirect to login if not authenticated
      // router.push('/login');
      return;
    }

    const urlTitle = searchParams.get('title') || '';
    const urlContent = searchParams.get('content') || '';
    const autoSubmit = searchParams.get('autoSubmit') === 'true';

    setTitle(urlTitle);
    setContent(urlContent);

    if (urlTitle && urlContent) {
        setStatus('Ready to submit.');
        if (autoSubmit) {
            handleSubmit();
        }
    } else {
        setStatus('Ready.');
    }

  }, [searchParams, isAuthLoading, user, campaign, handleSubmit]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  }

  if (isAuthLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Authenticating...</p>
        </div>
    );
  }

  if (!user || !campaign) {
    return (
         <div className="flex flex-col items-center justify-center min-h-screen">
             <p className="text-destructive max-w-md text-center">{status}</p>
             <Button onClick={() => router.push('/login')} className="mt-4">Go to Login</Button>
        </div>
    );
  }


  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Quick Narrative Post</CardTitle>
          <CardDescription>
            Use this form to quickly add a new narrative thread to your campaign. You can also pre-fill this form using URL parameters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitting ? (
             <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">{status}</p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The title of your new narrative post..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML is supported)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>The story continues...</p>"
                  required
                  rows={10}
                />
              </div>
              <div className="flex justify-between items-center">
                <Button type="submit" disabled={isSubmitting || !title || !content}>
                  Post to Narrative
                </Button>
                 <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
