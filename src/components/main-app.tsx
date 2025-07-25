'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateThumbnailsFromText } from '@/ai/flows/generate-thumbnail-from-text';
import { generateThumbnailsFromImageAndText } from '@/ai/flows/generate-thumbnail-from-image-and-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ThumbnailResults } from '@/components/thumbnail-results';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { ThumbForgeIcon } from './icons';
import { Wand2, Upload, Loader2, CaseSensitive, Settings } from 'lucide-react';
import { getApiKey } from '@/lib/api-key-store';

const textSchema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
  thumbnailText: z.string().optional(),
  aspectRatio: z.enum(['landscape', 'square']).default('landscape'),
});
type TextFormData = z.infer<typeof textSchema>;

const imageSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  image: z.any().refine((files) => files?.length === 1, 'Image is required.'),
  thumbnailText: z.string().optional(),
  aspectRatio: z.enum(['landscape', 'square']).default('landscape'),
});
type ImageFormData = z.infer<typeof imageSchema>;

export function MainApp() {
  const { toast } = useToast();
  const [thumbnails, setThumbnails] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);

  const textForm = useForm<TextFormData>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      aspectRatio: 'landscape',
    }
  });

  const imageForm = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      aspectRatio: 'landscape',
    }
  });

  const handleError = (error: any) => {
    console.error(error);
    const errorMessage = error.message || 'An unexpected error occurred.';
    
    if (errorMessage.includes('API key not valid')) {
       toast({
        title: 'Invalid API Key',
        description: 'Please check your API key and try again. You can set one in the settings.',
        variant: 'destructive',
      });
      setIsApiDialogOpen(true);
    } else {
      toast({
        title: 'Error Generating Thumbnails',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onTextSubmit: SubmitHandler<TextFormData> = async (data) => {
    setIsLoading(true);
    setThumbnails(null);
    try {
      const apiKey = getApiKey();
      const result = await generateThumbnailsFromText({ 
        prompt: data.prompt,
        thumbnailText: data.thumbnailText,
        aspectRatio: data.aspectRatio,
        apiKey: apiKey ?? undefined,
      });
      setThumbnails(Object.values(result));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onImageSubmit: SubmitHandler<ImageFormData> = async (data) => {
    setIsLoading(true);
    setThumbnails(null);
    try {
      const apiKey = getApiKey();
      const photoDataUri = await toDataURL(data.image[0]);
      const result = await generateThumbnailsFromImageAndText({
        description: data.description,
        photoDataUri,
        thumbnailText: data.thumbnailText,
        aspectRatio: data.aspectRatio,
        apiKey: apiKey ?? undefined,
      });
      setThumbnails(Object.values(result));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ApiKeyDialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen} />
      <div className="flex flex-col min-h-screen bg-background">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b justify-between bg-card">
          <div className="flex items-center gap-2">
            <ThumbForgeIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Thumnailer AI</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsApiDialogOpen(true)}>
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <section className="text-center w-full max-w-4xl mx-auto mb-12 opacity-0 fade-in">
            <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-orange-400">
              Nail your thumbnails.
            </h2>
          </section>

          <Card className="w-full max-w-2xl mx-auto opacity-0 fade-in-delay-2 shadow-2xl shadow-primary/10">
            <Tabs defaultValue="text" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text"><Wand2 className="mr-2" /> From Text</TabsTrigger>
                  <TabsTrigger value="image"><Upload className="mr-2" /> From Image</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="text">
                  <form onSubmit={textForm.handleSubmit(onTextSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="prompt">Your Thumbnail Idea</Label>
                      <Textarea
                        id="prompt"
                        placeholder="e.g., 'A vibrant synthwave landscape with a retro car driving into the sunset'"
                        className="min-h-[100px]"
                        {...textForm.register('prompt')}
                      />
                      {textForm.formState.errors.prompt && (
                        <p className="text-sm text-destructive">{textForm.formState.errors.prompt.message}</p>
                      )}
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="thumbnailText">Thumbnail Text (Optional)</Label>
                      <div className="relative">
                        <CaseSensitive className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="thumbnailText"
                          placeholder="e.g., 'NEW UPDATE!'"
                          className="pl-10"
                          {...textForm.register('thumbnailText')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Aspect Ratio</Label>
                       <Controller
                          control={textForm.control}
                          name="aspectRatio"
                          render={({ field }) => (
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex items-center space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="landscape" id="text-landscape" />
                                <Label htmlFor="text-landscape">Landscape (16:9)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="square" id="text-square" />
                                <Label htmlFor="text-square">Square (1:1)</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Forge with Text'}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="image">
                  <form onSubmit={imageForm.handleSubmit(onImageSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="image">Reference Image</Label>
                      <Input id="image" type="file" accept="image/*" {...imageForm.register('image')} />
                      {imageForm.formState.errors.image && (
                        <p className="text-sm text-destructive">{(imageForm.formState.errors.image.message as string)}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">How to modify it?</Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., 'Make this portrait look like a comic book character, add a speech bubble that says...'"
                        className="min-h-[100px]"
                        {...imageForm.register('description')}
                      />
                       {imageForm.formState.errors.description && (
                        <p className="text-sm text-destructive">{imageForm.formState.errors.description.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageThumbnailText">Thumbnail Text (Optional)</Label>
                      <div className="relative">
                         <CaseSensitive className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="imageThumbnailText"
                          placeholder="e.g., 'I CAN'T BELIEVE IT!'"
                          className="pl-10"
                          {...imageForm.register('thumbnailText')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Aspect Ratio</Label>
                        <Controller
                          control={imageForm.control}
                          name="aspectRatio"
                          render={({ field }) => (
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex items-center space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="landscape" id="image-landscape" />
                                <Label htmlFor="image-landscape">Landscape (16:9)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="square" id="image-square" />
                                <Label htmlFor="image-square">Square (1:1)</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Forge with Image'}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          {isLoading && (
            <div className="mt-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="mt-4 text-muted-foreground font-semibold">Forging your masterpieces...</p>
            </div>
          )}

          {thumbnails && <ThumbnailResults thumbnails={thumbnails} />}
        </main>
      </div>
    </>
  );
}
