import { useState, useMemo, useRef, useEffect } from "react";

function SearchableDropdown({ options, selectedVal, onSelect, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!query) return options.slice(0, 100);
    return options
      .filter((opt) => opt && opt.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 100);
  }, [options, query]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg p-3 cursor-pointer flex justify-between items-center hover:border-indigo-400 focus:ring-indigo-500 transition-all outline-none"
      >
        <span className={selectedVal ? "text-slate-800" : "text-slate-400"}>
          {selectedVal || placeholder}
        </span>
        <span className="text-slate-400 text-xs">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <input
              type="text"
              className="w-full bg-white border border-slate-300 text-sm rounded-md p-2 outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <ul className="max-h-60 overflow-y-auto p-1">
            <li
              className="p-2 text-sm text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
              onClick={() => {
                onSelect("");
                setIsOpen(false);
                setQuery("");
              }}
            >
              -- All --
            </li>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`p-2 text-sm rounded-md cursor-pointer transition-colors ${
                    selectedVal === opt
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="p-3 text-sm text-slate-400 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;