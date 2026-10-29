"use client";

import { useState } from "react";
import { redeemPointsAction } from "@/actions/shop";

export default function RedeemButton({ id, name, cost }: { id: number; name: string; cost: number }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);

  return (
    <>
      <button
        type="button"
        className="btn"
        onClick={() => {
          setQty(1);
          setOpen(true);
        }}
      >
        🛒 Buy Now
      </button>

      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close" onClick={() => setOpen(false)} aria-label="Tutup">
              ×
            </button>
            <h2>Confirm Purchase</h2>
            <p>Are you sure you want to buy {name}?</p>
            <p>
              Points cost: {cost} × {qty} = <strong>{cost * qty}</strong>
            </p>
            <form action={redeemPointsAction}>
              <input type="hidden" name="reward_id" value={id} />
              <label htmlFor={`qty-${id}`}>Quantity:</label>
              <input
                id={`qty-${id}`}
                name="quantity"
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value)) || 1))}
              />
              <button type="submit" className="btn btn-green">
                Confirm Purchase
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
