import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { matchReason, searchMovies } from "../utils/search";
import Highlight from "./Highlight";
import Icon from "./Icon";
import styles from "../css/components/SearchBox.module.css";

const MAX_SUGGESTIONS = 5;

// ช่องค้นหาใน Header: พิมพ์แล้วแนะนำหนัง, ↑↓ เลือก, Enter ไปหน้าผลการค้นหา, Esc ปิด
export default function SearchBox({ autoFocus = false, onDone, className = "" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(() =>
    pathname === "/search" ? params.get("q") ?? "" : ""
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  const suggestions = searchMovies(query).slice(0, MAX_SUGGESTIONS);
  const showList = open && query.trim().length > 0;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  const finish = (path) => {
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
    navigate(path);
    onDone?.();
  };

  const goSearch = () => {
    const q = query.trim();
    if (q) finish(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showList && active >= 0 && suggestions[active]) {
        finish(`/movies/${suggestions[active].id}`);
      } else {
        goSearch();
      }
    } else if (e.key === "Escape") {
      if (showList) setOpen(false);
      else {
        inputRef.current?.blur();
        onDone?.();
      }
    }
  };

  return (
    <div className={`${styles.root} ${className}`} ref={rootRef}>
      <div className={styles.field}>
        <Icon name="search" size={16} />
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          placeholder="ค้นหาหนัง ผู้กำกับ นักแสดง…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-label="ค้นหา"
        />
        {query && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="ล้างคำค้น"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {showList && (
        <div className={styles.panel}>
          {suggestions.length ? (
            <ul id={listId} role="listbox" className={styles.list}>
              {suggestions.map((m, i) => {
                const reason = matchReason(m, query);
                return (
                  <li
                    key={m.id}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={active === i}
                    className={`${styles.option} ${active === i ? styles.optionActive : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => finish(`/movies/${m.id}`)}
                  >
                    <img className={styles.thumb} src={m.poster} alt="" />
                    <span className={styles.optionText}>
                      <span className={styles.optionTitle}>
                        <Highlight text={m.title} query={query} className={styles.mark} />
                      </span>
                      <span className={styles.optionMeta}>
                        {reason ?? `${m.year} · ${m.genreLabel}`}
                      </span>
                    </span>
                    <span className={styles.optionScore}>★ {m.score}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.none}>ไม่พบหนังที่ตรงกับ “{query.trim()}”</p>
          )}
          <button
            type="button"
            className={styles.all}
            onMouseDown={(e) => e.preventDefault()}
            onClick={goSearch}
          >
            <Icon name="search" size={14} />
            ดูผลลัพธ์ทั้งหมดสำหรับ “{query.trim()}”
            <kbd>Enter</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
