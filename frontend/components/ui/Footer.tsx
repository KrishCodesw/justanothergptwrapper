import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { SiX } from "react-icons/si";
import { FaLink } from "react-icons/fa6";
// You can replace this with your app's name
const APP_NAME = "the best sql tool on the internet";

export function Footer() {
  return (
    <footer className="border-t w-full  bg-linear-to-b from-amber-50 via-amber-100  to-amber-700">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright Notice */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground pl-6">{APP_NAME}.</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4">
            <Button
              variant="link"
              asChild
              className="hover:scale-175 transition-all duration-300"
            >
              <Link target="_blank" href="https://github.com/KrishCodesw/">
                <SiGithub />
              </Link>
            </Button>
            <Button
              variant="link"
              asChild
              className="hover:scale-175 transition-all duration-300"
            >
              <Link target="_blank" href="https://x.com/KrishJainw/">
                <SiX />
              </Link>
            </Button>
            <Button
              variant="link"
              asChild
              className="hover:scale-175 transition-all duration-300"
            >
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
