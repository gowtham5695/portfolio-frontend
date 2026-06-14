import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';
import { Trash2, Mail, Loader2, Calendar, User } from 'lucide-react';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await portfolioService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await portfolioService.deleteMessage(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-violet-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Synchronizing mail server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-white">Contact Inbox</h2>
        <p className="text-gray-400 text-sm mt-1">Read and manage incoming inquiries from visitors of your portfolio.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
          <Mail size={20} className="text-violet-400" /> Inbox Messages ({messages.length})
        </h3>

        {messages.length === 0 ? (
          <div className="glass-panel p-10 rounded-xl border border-white/5 text-center text-gray-500 text-sm">
            Your inbox is currently empty. Incoming contact forms will appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className="glass-panel p-6 rounded-xl border border-white/5 hover:border-violet-500/10 transition-colors flex flex-col md:flex-row justify-between items-start gap-4"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-white text-sm">
                      <User size={14} className="text-cyan-400" /> {msg.name}
                    </span>
                    <span className="text-gray-400 font-medium text-xs break-all">{msg.email}</span>
                    <span className="flex items-center gap-1 text-gray-500 font-medium ml-auto md:ml-0">
                      <Calendar size={12} /> {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-violet-400 font-bold uppercase tracking-wide">Subject: {msg.subject}</span>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap pt-1">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="self-end md:self-start flex gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=${encodeURIComponent("\n\n---\nQuoted Message:\n" + msg.message)}`}
                    className="flex items-center gap-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="flex items-center gap-1 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MessagesManagement;
