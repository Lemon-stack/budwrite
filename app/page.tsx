import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div>
      LandingPage
      <Link href="/signin">
        <Button>Continue</Button>
      </Link>
    </div>
  );
}
