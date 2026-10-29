import Link from "next/link";
import { loginAction } from "@/actions/auth";
import ActionForm from "@/components/ActionForm";

export default function LoginPage({ searchParams }: { searchParams: { message?: string; error?: string } }) {
  return (
    <div className="center-screen">
      <div className="login-container">
        <h2>Login</h2>
        <ActionForm
          action={loginAction}
          submitLabel="Login"
          initialError={searchParams.error}
          initialMessage={searchParams.message}
          fields={[
            { name: "name", label: "Name:", autoComplete: "username" },
            { name: "password", label: "Password:", type: "password", autoComplete: "current-password" },
          ]}
        />
        <p className="auth-switch">
          Belum punya akun? <Link href="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
