import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <Search size={16} className="search-bar-icon" />
      <input
        className="form-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="search-bar-clear" onClick={() => onChange('')}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchBar
