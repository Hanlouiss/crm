import Link from "next/link";
import { registerAction } from "@/actions/auth";
import ActionForm from "@/components/ActionForm";

export default function RegisterPage() {
  return (
    <div className="center-screen">
      <div className="login-container">
        <h2>Create Akun</h2>
        <ActionForm
          action={registerAction}
          submitLabel="Daftar"
          fields={[
            { name: "name", label: "Name:", autoComplete: "username", maxLength: 255 },
            { name: "email", label: "Email:", type: "email", autoComplete: "email", maxLength: 255 },
            { name: "password", label: "Password:", type: "password", autoComplete: "new-password" },
          ]}
        />
        <p className="auth-switch">
          Sudah punya akun? <Link href="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
