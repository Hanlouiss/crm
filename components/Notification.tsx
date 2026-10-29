"use client";

import { useEffect, useState } from "react";

export default function Notification({ message }: { message?: string }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message || !visible) return null;
  return <div className="notification">{message}</div>;
}
