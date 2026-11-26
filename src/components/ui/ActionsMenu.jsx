import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

const GAP = 4;
const EDGE = 8;

/**
 * Row actions behind a "⋯" button.
 *
 * items: [{ id, label, icon?: LucideIcon, onSelect, danger?, disabled?, hidden?, separatorBefore? }]
 *
 * The menu renders in a portal with fixed positioning, so a table's
 * overflow never clips it; it opens upward when there's no room below.
 * Keyboard: Enter/Space/ArrowDown open it, arrows/Home/End move, Esc or Tab
 * closes. A click outside closes it.
 */
export default function ActionsMenu({ label = "Actions", items = [], align = "right", buttonClassName = "" }) {
  const visible = items.filter((item) => item && !item.hidden);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: -9999, left: -9999 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const itemRefs = useRef([]);
  const focusOnOpen = useRef(0);
  const menuId = useId();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  const place = useCallback(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;
    const rect = button.getBoundingClientRect();
    const width = menu.offsetWidth || 208;
    const height = menu.offsetHeight || 0;
    let top = rect.bottom + GAP;
    if (top + height > window.innerHeight - EDGE && rect.top - GAP - height > EDGE) {
      top = rect.top - GAP - height;
    }
    let left = align === "right" ? rect.right - width : rect.left;
    left = Math.max(EDGE, Math.min(left, window.innerWidth - width - EDGE));
    setPosition({ top, left });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const target = focusOnOpen.current === -1 ? visible.length - 1 : 0;
    const enabled = itemRefs.current.filter((el) => el && !el.disabled);
    (itemRefs.current[target] && !itemRefs.current[target].disabled ? itemRefs.current[target] : enabled[0])?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (menuRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      close(false);
    };
    const onScroll = (event) => {
      if (menuRef.current?.contains(event.target)) return;
      close(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close, place]);

  if (!visible.length) return null;

  const move = (delta) => {
    const els = itemRefs.current.filter((el) => el && !el.disabled);
    if (!els.length) return;
    const index = els.indexOf(document.activeElement);
    els[(index + delta + els.length) % els.length].focus();
  };

  const onMenuKeyDown = (event) => {
    const els = itemRefs.current.filter((el) => el && !el.disabled);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        els[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        els.at(-1)?.focus();
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
      default:
        break;
    }
  };

  const onButtonKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusOnOpen.current = event.key === "ArrowUp" ? -1 : 0;
      setOpen(true);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          focusOnOpen.current = 0;
          setOpen((v) => !v);
        }}
        onKeyDown={onButtonKeyDown}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${open ? "bg-gray-100 text-gray-800" : ""} ${buttonClassName}`}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="z-[70] w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl"
          >
            {visible.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id || item.label}>
                  {item.separatorBefore && index > 0 && <div role="separator" className="my-1.5 border-t border-gray-100" />}
                  <button
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    disabled={item.disabled}
                    onClick={() => {
                      close(!item.keepFocusAway);
                      item.onSelect?.();
                    }}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                      item.danger
                        ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
                        : "text-gray-700 hover:bg-gray-50 focus:bg-gray-100"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
                    {item.label}
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
