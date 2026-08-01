import React from "react";
interface TabItem { id: string; label: string; icon?: React.ReactNode; }
interface TabsProps { tabs: TabItem[]; activeTab: string; onTabChange: (id: string) => void; }
export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} aria-selected={activeTab === tab.id}>
          {tab.icon}<span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
export default Tabs;
