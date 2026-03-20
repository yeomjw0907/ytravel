"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface HotelSuggestionItem {
  id: string;
  slug: string;
  name: string;
  displayName?: string;
  city: string;
  country?: string;
}

const DEBOUNCE_MS = 280;
const AUTOCOMPLETE_ID = "hotel-autocomplete-listbox";

async function fetchSuggestions(q: string): Promise<HotelSuggestionItem[]> {
  if (!q.trim()) return [];
  const res = await fetch(`/api/hotels/autocomplete?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.suggestions ?? [];
}

export function HotelAutocomplete({
  name = "hotelName",
  label = "호텔명",
  placeholder = "예: 그랜드 하얏트 서울",
  defaultValue = "",
  required = true,
}: {
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<HotelSuggestionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    fetchSuggestions(q)
      .then((list) => {
        setSuggestions(list);
        setHighlight(0);
        setOpen(list.length > 0);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [runSearch, value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeId =
    open && suggestions[highlight]
      ? `${AUTOCOMPLETE_ID}-${suggestions[highlight].id}`
      : undefined;

  const select = (item: HotelSuggestionItem) => {
    setValue(item.displayName ?? item.name);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((index) => (index < suggestions.length - 1 ? index + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((index) => (index > 0 ? index - 1 : suggestions.length - 1));
      return;
    }

    if (e.key === "Enter" && suggestions[highlight]) {
      e.preventDefault();
      select(suggestions[highlight]);
    }
  };

  return (
    <div className="flex flex-col gap-wt-1" ref={rootRef}>
      {label && (
        <label
          htmlFor="hotel-autocomplete-input"
          className="text-wt-body-sm font-medium text-wt-text-primary"
        >
          {label}
        </label>
      )}
      <input type="hidden" name={name} value={value} readOnly />
      <div className="relative">
        <input
          id="hotel-autocomplete-input"
          type="text"
          role="combobox"
          autoComplete="off"
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value.trim() && suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-controls={open ? AUTOCOMPLETE_ID : undefined}
          aria-expanded={open}
          aria-activedescendant={activeId}
          className="w-full rounded-wt-md border-2 border-wt-border bg-wt-panel px-wt-3 py-wt-2.5 text-wt-body-md text-wt-text-primary placeholder:text-wt-text-secondary transition-colors focus-wt hover:border-wt-brand-300 focus-visible:ring-wt-brand-500/20 disabled:bg-wt-surface disabled:text-wt-text-secondary"
        />
        {loading && (
          <span
            className="absolute right-wt-3 top-1/2 -translate-y-1/2 text-wt-caption text-wt-text-secondary"
            aria-hidden
          >
            검색 중...
          </span>
        )}
        {open && suggestions.length > 0 && (
          <ul
            id={AUTOCOMPLETE_ID}
            role="listbox"
            className="absolute top-full left-0 z-20 mt-wt-1 max-h-60 w-full overflow-auto rounded-wt-md border border-wt-border bg-wt-panel py-wt-1 shadow-wt-soft"
          >
            {suggestions.map((item, index) => (
              <li
                key={item.id}
                role="option"
                id={`${AUTOCOMPLETE_ID}-${item.id}`}
                aria-selected={index === highlight}
                className={`cursor-pointer px-wt-3 py-wt-2 text-wt-body-sm text-wt-text-primary hover:bg-wt-surface ${
                  index === highlight ? "bg-wt-surface" : ""
                }`}
                onMouseEnter={() => setHighlight(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(item);
                }}
              >
                <span className="font-medium">{item.displayName ?? item.name}</span>
                {(item.city || item.country) && (
                  <span className="ml-wt-2 text-wt-text-secondary">
                    {[item.city, item.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
