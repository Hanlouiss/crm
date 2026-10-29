"use client";

export default function DeleteButton({
  label = "Delete",
  message = "Apakah Anda yakin ingin menghapus data ini?",
}: {
  label?: string;
  message?: string;
}) {
  return (
    <button
      type="submit"
      className="btn btn-danger"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
