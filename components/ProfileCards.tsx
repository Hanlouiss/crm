"use client";

import { useState } from "react";
import type { DataPelanggan } from "@/lib/types";

export default function ProfileCards({ items }: { items: DataPelanggan[] }) {
  const [selected, setSelected] = useState<DataPelanggan | null>(null);

  return (
    <>
      <div className="card-list">
        {items.map((p) => (
          <button type="button" className="profile-card" key={p.id_pelanggan} onClick={() => setSelected(p)}>
            <h3>{p.nama}</h3>
            <p>Telp: {p.no_telp}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" onClick={() => setSelected(null)} aria-label="Tutup">
              ×
            </button>
            <h2>Profile Details</h2>
            <h3>Name: {selected.nama}</h3>
            <p>Tanggal Lahir: {selected.tanggal_lahir}</p>
            <p>Address: {selected.tempat_tinggal}</p>
            <p>Phone: {selected.no_telp}</p>
          </div>
        </div>
      )}
    </>
  );
}
