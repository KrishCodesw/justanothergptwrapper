import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { SiX } from "react-icons/si";
import { FaLink } from "react-icons/fa6";
// You can replace this with your app's name
const APP_NAME = "justanothergptwrapper";

export function Footer() {
  return (
    <footer className="border-t w-full">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright Notice */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">{APP_NAME}.</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4">
            <Button variant="link" asChild className="">
              <Link target="_blank" href="https://github.com/KrishCodesw/">
                <SiGithub />
              </Link>
            </Button>
            <Button variant="link" asChild className="text-muted-foreground">
              <Link target="_blank" href="https://x.com/KrishJainw/">
                <SiX />
              </Link>
            </Button>
            <Button variant="link" asChild className="text-muted-foreground">
              <Link target="_blank" href="https://krishjain-me.vercel.app">
                <FaLink />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
