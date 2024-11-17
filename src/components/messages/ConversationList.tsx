import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMessageStore } from '../../stores/messageStore';
import { User } from '../../types/user';
import { useAuthStore } from '../../stores/authStore';

interface ConversationListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  users,
  selectedUserId,
  onSelectUser,
}) => {
  const { user: currentUser } = useAuthStore();
  const { getConversation } = useMessageStore();

  return (
    <div className="overflow-y-auto h-full">
      {users.map((user) => {
        if (user.id === currentUser?.id) return null;
        
        const conversation = getConversation(user.id);
        const lastMessage = conversation[conversation.length - 1];
        const unreadCount = conversation.filter(
          (msg) => msg.recipientId === currentUser?.id && !msg.readAt
        ).length;

        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`w-full text-left p-4 hover:bg-gray-50 focus:outline-none ${
              selectedUserId === user.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {user.nombre} {user.apellidos}
                </h3>
                {lastMessage && (
                  <>
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(lastMessage.createdAt), 'PPp', { locale: es })}
                    </p>
                  </>
                )}
              </div>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;