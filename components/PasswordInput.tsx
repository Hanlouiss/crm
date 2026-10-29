"use client";

import { useState } from "react";

export default function PasswordInput({ id, name, autoComplete }: { id: string; name: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-field">
      <input id={id} name={name} type={show ? "text" : "password"} required autoComplete={autoComplete} />
      <button
        type="button"
        className="toggle"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}
