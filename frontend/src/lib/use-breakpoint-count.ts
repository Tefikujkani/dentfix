"use client";

import { useEffect, useState } from "react";

export function useBreakpointCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    function update() {
      const width = window.innerWidth;
      if (width >= 1280) setCount(3);
      else if (width >= 768) setCount(2);
      else setCount(1);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}
