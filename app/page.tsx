import { redirect } from "next/navigation";

// Middleware normally redirects "/" by role; this is only a fallback.
export default function Home() {
  redirect("/dashboard");
}
