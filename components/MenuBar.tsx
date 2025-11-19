
import React from 'react';
import type { MenuItemConfig } from '../App';

interface MenuBarProps {
  items: MenuItemConfig[];
  activeItem: MenuItemConfig;
  onItemClick: (item: MenuItemConfig) => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ items, activeItem, onItemClick, isLightMode, onToggleLightMode }) => {
  return (
    <nav className="w-full bg-green-100 border border-green-300 rounded-lg mb-2 shadow-lg" aria-label="Main navigation">
      <div className="flex flex-wrap items-center justify-between px-4 py-2">
        <ul className="flex flex-wrap items-center justify-center sm:justify-start">
          {items.map((item) => {
            const isActive = item.name === activeItem.name;
            return (
              <li key={item.name} className="mx-2 my-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onItemClick(item);
                  }}
                  className={`px-3 py-2 rounded-md text-xl font-bold transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black ${
                    isActive
                      ? 'bg-green-300 text-black border border-black'
                      : 'text-black hover:bg-green-200'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name}`}
                >
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>

      </div>
    </nav>
  );
};

export default MenuBar;
