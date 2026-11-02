import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchLocation } from '../../services/nominatimService';
import { SkeletonListItem } from '../Skeleton';

export default function WaypointRow({ index, wp, onUpdate, onRemove, isDark = false }) {
  const [query, setQuery] = useState(wp.location?.displayName || wp.query || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (wp.location?.displayName && query !== wp.location.displayName) {
      setQuery(wp.location.displayName);
    }
  }, [wp.location]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2 && (!wp.location || query !== wp.location.displayName)) {
        setIsSearching(true);
        const results = await searchLocation(query);
        setSuggestions(results);
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, wp.location]);

  return (
    <div className="space-y-1 relative">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-ink-secondary flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-warning text-white text-[9px] font-extrabold flex items-center justify-center">
            {index + 1}
          </span>
          <span>Via Stop {index + 1}</span>
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-danger hover:underline font-semibold cursor-pointer"
        >
          ✕ Remove
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onUpdate({ ...wp, query: e.target.value, location: null });
          }}
          placeholder="Intermediate town or highway stop"
          className={`w-full rounded-lg pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary border ${
            isDark 
              ? 'bg-[#0b0f19] border-[rgba(34,211,238,0.15)] text-[#e2e8f0] placeholder-[#64748b]' 
              : 'bg-white border-surface-border text-ink placeholder-ink-tertiary'
          }`}
        />
        <Search className="w-3.5 h-3.5 text-ink-tertiary absolute right-2.5 top-2.5" />
      </div>

      {isSearching && (
        <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
          isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
        }`}>
          <SkeletonListItem />
          <SkeletonListItem />
        </div>
      )}

      {suggestions.length > 0 && !wp.location && !isSearching && (
        <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-card-lg max-h-40 overflow-y-auto z-30 divide-y ${
          isDark ? 'bg-[#111827] border-[rgba(34,211,238,0.2)] divide-[rgba(34,211,238,0.1)]' : 'bg-white border-surface-border divide-surface-border'
        }`}>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const loc = { lat: item.lat, lng: item.lng, displayName: item.displayName };
                setQuery(item.displayName);
                setSuggestions([]);
                onUpdate({ ...wp, location: loc, query: item.displayName });
              }}
              className={`w-full text-left px-2.5 py-2 text-[11px] flex items-start space-x-2 cursor-pointer ${
                isDark ? 'text-[#e2e8f0] hover:bg-[#1a2035]' : 'text-ink hover:bg-surface-subtle'
              }`}
            >
              <MapPin className="w-3 h-3 text-warning mt-0.5 shrink-0" />
              <span className="truncate">{item.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
