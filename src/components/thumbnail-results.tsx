'use client';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface ThumbnailResultsProps {
  thumbnails: string[];
}

export function ThumbnailResults({ thumbnails }: ThumbnailResultsProps) {
  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `thumbnail-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <section className="w-full max-w-6xl mx-auto mt-12 opacity-0 slide-in-from-bottom">
      <h3 className="text-3xl font-bold text-center font-headline mb-8">Your Forged Thumbnails</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {thumbnails.map((thumbnail, index) => (
          <div key={index} className="opacity-0 fade-in" style={{ animationDelay: `${index * 200}ms` }}>
            <Card className="overflow-hidden group transition-all duration-300 hover:shadow-primary/40 hover:shadow-lg hover:-translate-y-2">
              <CardContent className="p-0 relative">
                <Image
                  src={thumbnail}
                  alt={`Generated Thumbnail ${index + 1}`}
                  width={512}
                  height={288}
                  className="w-full h-auto aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="lg" onClick={() => handleDownload(thumbnail, index)}>
                    <Download className="mr-2 h-5 w-5" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
