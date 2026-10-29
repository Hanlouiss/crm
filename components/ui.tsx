import Link from "next/link";
import { logoutAction } from "@/actions/auth";

export function LogoutButton({ className = "btn btn-danger", label = "Logout" }: { className?: string; label?: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="error">{message}</p>;
}

export function BackLink({ href, label = "Kembali" }: { href: string; label?: string }) {
  return (
    <Link className="back-button" href={href}>
      {label}
    </Link>
  );
}
