

export const Navbar = () => {
    return (
        <nav className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-6 sticky top-0 z-50 rounded-none border-x-0 border-t-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    EnviroSense
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-card border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-sm font-semibold text-white shadow-lg cursor-pointer">
                    T
                </div>
            </div>
        </nav>
    );
};
