import Link from "next/link";
import { Button } from "@/components/ui/button";

// You can replace this with your app's name
const APP_NAME = "SummarizeAI";

export function Footer() {
  return (
    <footer className="border-t w-full">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright Notice */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4">
            <Button variant="link" asChild className="text-muted-foreground">
              <Link href="/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="link" asChild className="text-muted-foreground">
              <Link href="/terms">Terms of Service</Link>
            </Button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
