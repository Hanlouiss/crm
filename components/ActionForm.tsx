"use client";

import { useFormState, useFormStatus } from "react-dom";
import PasswordInput from "./PasswordInput";
import type { ActionState } from "@/lib/types";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "date" | "tel";
  autoComplete?: string;
  maxLength?: number;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-block" disabled={pending}>
      {pending ? "Memproses..." : label}
    </button>
  );
}

export default function ActionForm({
  action,
  fields,
  submitLabel,
  initialError,
  initialMessage,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  fields: Field[];
  submitLabel: string;
  initialError?: string;
  initialMessage?: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const error = state ? state.error : initialError;
  const message = state ? state.message : initialMessage;

  return (
    <form action={formAction}>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {fields.map((f) => (
        <div className="form-group" key={f.name}>
          <label htmlFor={f.name}>{f.label}</label>
          {f.type === "password" ? (
            <PasswordInput id={f.name} name={f.name} autoComplete={f.autoComplete} />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              autoComplete={f.autoComplete}
              maxLength={f.maxLength}
              required
            />
          )}
        </div>
      ))}

      <Submit label={submitLabel} />
    </form>
  );
}
