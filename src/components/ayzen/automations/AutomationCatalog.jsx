import React, { useState } from "react";
import AutomationCard from "./AutomationCard";
import { AUTOMATION_TEMPLATES, AUTOMATION_CATEGORIES } from "./automationTemplates";

export default function AutomationCatalog() {
  const [activeIds, setActiveIds] = useState([]);

  const handleToggle = (id) => {
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Agrupa por categoria na ordem definida
  const orderedCategories = Object.entries(AUTOMATION_CATEGORIES).sort(
    (a, b) => a[1].order - b[1].order
  );

  return (
    <div className="space-y-6">
      {orderedCategories.map(([catKey, cat]) => {
        const items = AUTOMATION_TEMPLATES.filter((t) => t.category === catKey);
        if (items.length === 0) return null;
        return (
          <div key={catKey}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                {cat.label}
              </h2>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400">{items.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((tpl) => (
                <AutomationCard
                  key={tpl.id}
                  template={tpl}
                  active={activeIds.includes(tpl.id)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}