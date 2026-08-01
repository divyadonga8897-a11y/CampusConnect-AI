import React from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs?: TabItem[];
  items?: TabItem[];
  activeTab?: string;
  activeId?: string;
  onTabChange?: (id: string) => void;
  onChange?: (id: string) => void;
}

export function Tabs({ tabs, items, activeTab, activeId, onTabChange, onChange }: TabsProps) {
  const displayTabs = tabs || items || [];
  const currentActive = activeTab || activeId;
  const triggerChange = onTabChange || onChange;

  return (
    <div>
      {displayTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => triggerChange && triggerChange(tab.id)}
          aria-selected={currentActive === tab.id}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default Tabs;
