
import React, { useState } from 'react';
import IframeViewer from './components/IframeViewer';
import MenuBar from './components/MenuBar';
import Chatbot from './components/Chatbot';
import ChatPage from './components/ChatPage';

export interface MenuItemConfig {
  name: string;
  url?: string;
  headerHeight?: number;
  footerHeight?: number;
}

const menuItems: MenuItemConfig[] = [
    { name: "Chat" },
];

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<MenuItemConfig>(menuItems[0]);
  const [isLightMode, setIsLightMode] = useState(true);
  
  // Access the API key directly from the environment variable.
  // This avoids prompting the user to enter it manually.
  const apiKey = process.env.API_KEY || "";

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans">
      <div className="w-full max-w-screen-2xl flex-grow flex flex-col">
        <header className="w-full mb-4 flex items-center justify-center bg-white p-4 rounded-lg shadow-sm">
           <img 
              src="https://i.ibb.co/Ps2sFLY0/Gemini-Generated-Image-it0duiit0duiit0d-removebg-preview.png" 
              alt="Javed Iqbal Securities Logo" 
              className="h-24 sm:h-32 w-auto object-contain"
            />
        </header>

        <main className="w-full flex-grow flex flex-col">
          <MenuBar
            items={menuItems}
            activeItem={activeItem}
            onItemClick={setActiveItem}
            isLightMode={isLightMode}
            onToggleLightMode={() => setIsLightMode(!isLightMode)}
          />
          {activeItem.name === 'Chat' ? (
            <ChatPage apiKey={apiKey} />
          ) : (
            <IframeViewer
              src={activeItem.url!}
              key={activeItem.url}
              headerHeight={activeItem.headerHeight!}
              footerHeight={activeItem.footerHeight!}
              isLightMode={isLightMode}
            />
          )}
        </main>
      </div>
      {activeItem.name !== 'Chat' && <Chatbot apiKey={apiKey} />}
    </div>
  );
};

export default App;
