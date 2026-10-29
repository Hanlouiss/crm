import Link from "next/link";
import { ErrorBanner } from "./ui";
import type { LogRow } from "@/lib/types";

export default function CustomerForm({
  action,
  user,
  submitLabel,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  user?: LogRow;
  submitLabel: string;
  error?: string;
}) {
  const isEdit = Boolean(user);
  return (
    <form action={action}>
      <ErrorBanner message={error} />
      {user && <input type="hidden" name="id" value={user.id} />}

      <label htmlFor="name">Nama Pelanggan:</label>
      <input type="text" name="name" id="name" defaultValue={user?.name ?? ""} required />

      <label htmlFor="email">Email:</label>
      <input type="email" name="email" id="email" defaultValue={user?.email ?? ""} required />

      <label htmlFor="password">Password{isEdit ? " (kosongkan jika tidak diubah)" : ""}:</label>
      <input type="password" name="password" id="password" required={!isEdit} autoComplete="new-password" />

      <label htmlFor="hak_akses">Hak Akses:</label>
      <select name="hak_akses" id="hak_akses" defaultValue={String(user?.hak_akses ?? 2)} required>
        <option value="1">Admin</option>
        <option value="2">Pelanggan</option>
      </select>

      <label htmlFor="membership">Membership:</label>
      <select name="membership" id="membership" defaultValue={String(user?.membership ?? 1)} required>
        <option value="1">Member</option>
        <option value="0">Bukan member</option>
      </select>

      <div className="button-container">
        <button type="submit" className="btn btn-pill">{submitLabel}</button>
        <Link href="/admin/pelanggan" className="btn btn-pill">Kembali</Link>
      </div>
    </form>
  );
}
