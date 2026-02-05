'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { normalizeForMatch } from '@/lib/stringUtils';
import styles from './GuessInput.module.css';

interface GuessInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (guess: string) => void;
  placeholder?: string;
  disabled?: boolean;
  suggestions?: string[];
  onReveal?: () => void;
  buttonSuffix?: string;
  /** When true, filter/sort suggestions using accent-insensitive matching (e.g. "sao" matches "São Paulo") */
  accentInsensitive?: boolean;
}

export default function GuessInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = 'Enter your guess...',
  disabled = false,
  suggestions = [],
  onReveal,
  buttonSuffix,
  accentInsensitive = false,
}: GuessInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = value.trim().toLowerCase();
  const norm = accentInsensitive ? (s: string) => normalizeForMatch(s) : (s: string) => s.trim().toLowerCase();
  const filteredSuggestions = (search
    ? suggestions
        .filter(s => norm(s).includes(norm(search)))
        .sort((a, b) => {
          const aStarts = norm(a).startsWith(norm(search));
          const bStarts = norm(b).startsWith(norm(search));
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.localeCompare(b);
        })
    : [...suggestions].sort((a, b) => a.localeCompare(b))
  ).slice(0, 8);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0 || !showSuggestions || filteredSuggestions.length === 0) {
      if (e.key === 'Enter') handleSubmit();
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          onChange(filteredSuggestions[highlightedIndex]);
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        if (e.key === 'Enter') handleSubmit();
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const hasSuggestions = suggestions.length > 0;

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => hasSuggestions && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
        />
        {hasSuggestions && showSuggestions && filteredSuggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`${styles.suggestionItem} ${index === highlightedIndex ? styles.highlighted : ''}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.buttonRow}>
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={styles.button}
        >
          Guess{buttonSuffix ? ` (${buttonSuffix})` : ''}
        </button>
        {onReveal && (
          <button
            type="button"
            onClick={onReveal}
            className={styles.revealButton}
          >
            Reveal
          </button>
        )}
      </div>
    </div>
  );
}
