import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        {/* 1. The Hook: Headline and Description */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Get the Gist. Instantly.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Tired of reading endless documents? Our AI reads your text, files,
            and links, giving you a clear, concise summary in seconds.
          </p>
        </div>

        {/* 2. The Tool: Interactive Tabs Component */}
        <div className="max-w-2xl mx-auto mt-12">
          <Tabs defaultValue="text" className="w-full">
            {/* Tab Triggers */}
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Paste Text</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>

            {/* Tab Content: Paste Text */}
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Paste your article, notes, or any text here..."
                className="min-h-[250px] text-base"
                aria-label="Paste text to summarize"
              />
            </TabsContent>

            {/* Tab Content: Upload File */}
            <TabsContent value="file" className="mt-4">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg min-h-[250px]">
                <Label htmlFor="file-upload" className="sr-only">
                  Upload a file
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  className="max-w-sm file:text-primary file:font-medium"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Supports PDF, DOCX, TXT (max 10MB)
                </p>
              </div>
            </TabsContent>

            {/* Tab Content: From URL */}
            <TabsContent value="url" className="mt-4">
              <div className="space-y-4 p-8 border rounded-lg min-h-[250px] flex flex-col justify-center">
                <Label htmlFor="url-input" className="text-lg font-medium">
                  Enter a URL to summarize
                </Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/article..."
                  className="text-base"
                />
                <p className="text-sm text-muted-foreground">
                  We'll fetch and summarize the content from any public webpage.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* The Main Call to Action Button */}
          <Button size="lg" className="w-full mt-6 text-lg">
            Summarize Now
          </Button>
        </div>
      </div>
    </section>
  );
}
