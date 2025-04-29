import Link from "next/link";
import Logo from "../logo";

const quickLinks = [
  { name: "Features", href: "/#features" },
  { name: "Testimonials", href: "/#testimonials" },
  //   { name: "Pricing", href: "/pricing" },
];

const ourApps = [
  { name: "Teamup", href: "https://teamupnow.site" },
  //   { name: "App 2", href: "https://app2.example.com" },
  //   { name: "App 3", href: "https://app3.example.com" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo text="text-zinc-300" />
            </Link>
            <p className="mt-4 text-sm text-white/70">
              Transform Your Pictures Into Epic Stories.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white/70">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-white/70">
              Affiliated Apps
            </h3>
            <ul className="space-y-2">
              {ourApps.map((app) => (
                <li key={app.name}>
                  <Link
                    href={app.href}
                    className="text-sm text-white/70 hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {app.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden">
            <h3 className="mb-4 text-sm font-semibold uppercase text-white/70">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} PictoStory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
