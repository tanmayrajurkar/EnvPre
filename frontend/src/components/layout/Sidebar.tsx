

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
    const menuItems = [
        { id: 'pollution', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Air Quality' },
        { id: 'rainfall', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z M12 18v4 M8 17v5 M16 17v5', label: 'Rainfall & Weather' },
        { id: 'climate', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Climate Trends' },
        { id: 'predictions', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'ML Predictions' },
    ];

    return (
        <aside className="w-64 border-r border-white/10 glass-panel h-[calc(100vh-4rem)] rounded-none border-y-0 border-l-0 overflow-y-auto">
            <div className="p-4 flex flex-col gap-2">
                <div className="text-xs font-semibold text-muted tracking-wider mb-2 uppercase px-3">Dashboards</div>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 w-full text-left font-medium
              ${activeTab === item.id
                                ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-primary/30'
                                : 'text-muted hover:bg-white/5 hover:text-text border border-transparent'}
            `}
                    >
                        <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-primary' : 'text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.label}
                    </button>
                ))}
            </div>
        </aside>
    );
};
