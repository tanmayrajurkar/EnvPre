import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const PageLayout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => {
    return (
        <div className="min-h-screen bg-background text-text flex flex-col font-sans">
            {/* Background ambient light effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
            </div>

            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto w-full h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
