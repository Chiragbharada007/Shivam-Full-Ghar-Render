"use client";

import React, { useState } from "react";

export function Interactive3DCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale(1)");

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTransform(`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.015)`);
  };

  return (
    <div style={{ perspective: "1000px" }} className="h-full">
      <div
        onMouseMove={handleMove}
        onMouseLeave={() => setTransform("rotateX(0deg) rotateY(0deg) scale(1)")}
        style={{ transform, transformStyle: "preserve-3d" }}
        className={`h-full transition-transform duration-200 ease-out will-change-transform ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
