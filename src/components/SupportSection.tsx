import { MessageSquare, Send, Facebook, Mail, ExternalLink, LifeBuoy, Users } from "lucide-react";

export default function SupportSection() {
  return (
    <div id="support-section" className="bg-white/5 border border-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-950/80 border border-red-800/80 px-3 py-1 rounded-full text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-3 select-none">
            <LifeBuoy className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Live Network Helpdesk
          </div>
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2 uppercase">
            ATV Sports <span className="text-red-500">Official Support</span>
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl">
            Join our online streaming telegram networks & facebook communities, request custom backup feeds, or email us.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Telegram Channel */}
        <a
          href="https://t.me/Atvsports"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-500/50 p-4 rounded-2xl transition duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
        >
          <div className="w-12 h-12 bg-sky-950/80 border border-sky-900 text-sky-400 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
            <Send className="w-5 h-5 fill-sky-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Official Broadcast</span>
            <h4 className="text-white font-display font-bold text-sm truncate group-hover:text-sky-400 transition-colors">Telegram Channel</h4>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono truncate">@Atvsports</p>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-sky-400 transition-colors flex-shrink-0" />
        </a>

        {/* Telegram Group */}
        <a
          href="https://t.me/Atvsportsgroup"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-400/50 p-4 rounded-2xl transition duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
        >
          <div className="w-12 h-12 bg-sky-950/40 border border-sky-900 text-sky-400 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Community Chat</span>
            <h4 className="text-white font-display font-bold text-sm truncate group-hover:text-sky-400 transition-colors">Telegram Group</h4>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono truncate">@Atvsportsgroup</p>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-sky-400 transition-colors flex-shrink-0" />
        </a>

        {/* Facebook Page */}
        <a
          href="https://www.facebook.com/atvsportss"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-600/50 p-4 rounded-2xl transition duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-950 border border-blue-900 text-blue-500 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
            <Facebook className="w-5 h-5 fill-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Official Fanpage</span>
            <h4 className="text-white font-display font-bold text-sm truncate group-hover:text-blue-500 transition-colors">Facebook Page</h4>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono truncate">atvsportss</p>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors flex-shrink-0" />
        </a>

        {/* Facebook Group */}
        <a
          href="https://facebook.com/groups/1000852144439938/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/50 p-4 rounded-2xl transition duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-950/60 border border-blue-900 text-blue-400 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-blue-450" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Community Group</span>
            <h4 className="text-white font-display font-bold text-sm truncate group-hover:text-blue-400 transition-colors">Facebook Group</h4>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono truncate">ATV Sports Fans</p>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors flex-shrink-0" />
        </a>

        {/* Email Support */}
        <a
          href="mailto:contactatvsports@gmail.com"
          className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-650/50 p-4 rounded-2xl transition duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer col-span-1 sm:col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 bg-red-950 border border-red-900 text-red-500 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
            <Mail className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Help & Complaints</span>
            <h4 className="text-white font-display font-bold text-sm truncate group-hover:text-red-500 transition-colors">Email Support</h4>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono truncate">contactatvsports@gmail.com</p>
          </div>
          <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-red-500 transition-colors flex-shrink-0" />
        </a>

      </div>
    </div>
  );
}
