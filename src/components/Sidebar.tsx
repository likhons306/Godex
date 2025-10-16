import React from 'react';
import { Button } from '@/components/ui/button';
import './Sidebar.css';

interface Conversation {
  id: string;
  title: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Button onClick={onNewChat} className="new-chat-button">
          + New Chat
        </Button>
      </div>
      <nav className="sidebar-nav">
        <ul className="conversation-list">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={`conversation-item ${
                conv.id === activeConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              {conv.title}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};