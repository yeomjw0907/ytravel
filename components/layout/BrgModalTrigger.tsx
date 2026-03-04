"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrgModal } from "@/components/ui/BrgModal";

const HASH = "brg";

/**
 * URL hash #brg 일 때 BRG 설명 모달 표시. 링크는 href="/#brg" 사용.
 */
export function BrgModalTrigger() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const checkHash = useCallback(() => {
    if (typeof window === "undefined") return;
    setOpen(window.location.hash.slice(1) === HASH);
  }, []);

  useEffect(() => {
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [checkHash]);

  useEffect(() => {
    if (open && pathname) checkHash();
  }, [open, pathname, checkHash]);

  const close = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", url);
    setOpen(false);
  }, []);

  if (!open) return null;
  return <BrgModal onClose={close} />;
}
