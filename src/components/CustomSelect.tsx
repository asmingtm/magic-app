import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiArrowDownSLine, RiCheckLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredOptions = searchable && search.trim()
    ? options.filter((opt) => {
        const query = search.toLowerCase();
        return (
          opt.label.toLowerCase().includes(query) ||
          (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
          (opt.badge && opt.badge.toLowerCase().includes(query))
        );
      })
    : options;

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={selectId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        className={`w-full bg-white dark:bg-[#1e1f20] border text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between gap-2 shadow-xs cursor-pointer select-none focus:outline-none ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-neutral-800'
            : isOpen
            ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
            : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className="shrink-0">{selectedOption.icon}</span>
              )}
              {selectedOption.badge && (
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: selectedOption.badgeColor || '#1a73e8' }}
                >
                  {selectedOption.badge}
                </span>
              )}
              <span className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                {selectedOption.label}
              </span>
              {selectedOption.sublabel && (
                <span className="text-gray-400 dark:text-gray-500 text-xs truncate hidden sm:inline">
                  · {selectedOption.sublabel}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 truncate">{placeholder}</span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 text-gray-400 dark:text-gray-400"
        >
          <RiArrowDownSLine className="w-4 h-4" />
        </motion.div>
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            tabIndex={-1}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md"
          >
            {/* Search Box if searchable */}
            {searchable && (
              <div className="p-2 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
                <div className="relative flex items-center">
                  <RiSearchLine className="w-3.5 h-3.5 absolute left-2.5 text-gray-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-white dark:bg-[#131314] border border-gray-200 dark:border-neutral-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <RiCloseLine className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              ref={listRef}
              className="max-h-56 sm:max-h-64 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer transition-colors duration-100 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        {opt.badge && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shrink-0 shadow-xs"
                            style={{ backgroundColor: opt.badgeColor || '#1a73e8' }}
                          >
                            {opt.badge}
                          </span>
                        )}
                        <span className="truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span
                            className={`text-[11px] truncate ${
                              isSelected
                                ? 'text-blue-600/70 dark:text-blue-400/70'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            · {opt.sublabel}
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <RiCheckLine className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
