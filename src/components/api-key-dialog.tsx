'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getApiKey, setApiKey } from '@/lib/api-key-store';
import { KeyRound } from 'lucide-react';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const [key, setKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const storedKey = getApiKey();
      if (storedKey) {
        setKey(storedKey);
      }
    }
  }, [open]);

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key);
      toast({
        title: 'API Key Saved',
        description: 'Your Google AI API key has been securely stored in your browser.',
      });
      onOpenChange(false);
    } else {
        toast({
        title: 'Invalid Key',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google AI API Key</DialogTitle>
          <DialogDescription>
            Enter your API key to generate thumbnails. Your key is stored securely in your browser's local storage and never sent to our servers. You can get a key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google AI Studio
            </a>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="apiKey"
              placeholder="Enter your API key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save and Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
