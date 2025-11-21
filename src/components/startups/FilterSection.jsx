import { ChevronDown, ChevronUp } from "lucide-react";

export default function FilterSection({ title, isCollapsed, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-medium mb-3 hover:text-neon-cyan transition-colors"
      >
        <span>{title}</span>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>
      {!isCollapsed && <div>{children}</div>}
    </div>
  );
}
