"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#doctors", label: "Doctors" },
  { href: "#treatments", label: "Pricing" },
];

type Pill = { left: number; width: number };

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("#top");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill>({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const hoverTimer = useRef<number>(0);

  useEffect(() => {
    function onScroll() {
      const about = document.getElementById("about");
      const threshold = about ? about.offsetTop - 90 : window.innerHeight * 0.7;
      setSolid(window.scrollY > threshold - 40);

      const ids = ["top", "about", "services", "doctors", "treatments", "booking"];
      let current = "#top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = `#${id}`;
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function movePill(href: string) {
    const nav = navRef.current;
    const link = linkRefs.current[href];
    if (!nav || !link) return;
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    setPill({ left: linkBox.left - navBox.left, width: linkBox.width });
  }

  function pillTarget() {
    const target = hovered ?? active;
    return target === "#booking" ? "#treatments" : target;
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => movePill(pillTarget()));
    return () => window.cancelAnimationFrame(frame);
  }, [hovered, active, solid]);

  useEffect(() => {
    function onResize() {
      movePill(pillTarget());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hovered, active]);

  function goTo(href: string) {
    setOpen(false);
    setHovered(null);
    setActive(href);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  function onEnter(href: string) {
    setHovered(href);
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => goTo(href), 420);
  }

  function onLeave() {
    window.clearTimeout(hoverTimer.current);
    setHovered(null);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`nav-shell ${solid ? "is-solid" : ""}`}>
        <span className="nav-blob" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="#top"
            className="flex items-center gap-2.5"
            onClick={(event) => {
              event.preventDefault();
              goTo("#top");
            }}
          >
            <span className={`text-lg font-semibold tracking-tight ${solid ? "text-ink" : "text-white"}`}>
              Dentfix
            </span>
          </a>

          <nav
            ref={navRef}
            className="relative hidden items-center lg:flex"
            aria-label="Primary"
            onMouseLeave={onLeave}
          >
            <span
              className={`nav-slider ${solid ? "is-light" : ""}`}
              style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
              aria-hidden="true"
            />
            {LINKS.map((link) => {
              const isOn = pillTarget() === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  ref={(node) => {
                    linkRefs.current[link.href] = node;
                  }}
                  onMouseEnter={() => onEnter(link.href)}
                  onClick={(event) => {
                    event.preventDefault();
                    window.clearTimeout(hoverTimer.current);
                    goTo(link.href);
                  }}
                  className={`relative z-10 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isOn ? (solid ? "text-white" : "text-ink") : solid ? "text-slate-600" : "text-white/85"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#booking"
              className="btn-primary btn-primary-sm press hidden sm:inline-flex"
              onClick={(event) => {
                event.preventDefault();
                goTo("#booking");
              }}
            >
              Contact Us
            </a>
            <button
              type="button"
              className={`press inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${
                solid ? "bg-white text-ink shadow-soft" : "bg-white/20 text-white"
              }`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav id="mobile-nav" className="relative z-50 mx-4 mt-2 rounded-2xl bg-white p-3 shadow-lift lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="press block rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-slate-50"
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#booking"
                className="press mt-1 block rounded-xl bg-clinic px-3 py-3 text-center text-sm font-semibold text-white"
                onClick={(event) => {
                  event.preventDefault();
                  goTo("#booking");
                }}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
        </>
      ) : null}
    </header>
  );
}
