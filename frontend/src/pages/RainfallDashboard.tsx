
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { month: 'Jan', rain: 65 },
    { month: 'Feb', rain: 59 },
    { month: 'Mar', rain: 80 },
    { month: 'Apr', rain: 81 },
    { month: 'May', rain: 56 },
    { month: 'Jun', rain: 120 },
    { month: 'Jul', rain: 210 },
    { month: 'Aug', rain: 190 },
];

export const RainfallDashboard = () => {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 inline-block">Precipitation & Weather</h1>
                <p className="text-muted mt-2">Analyze historical rainfall patterns and seasonal variations.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                    <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2 justify-between flex">
                        <span>Monthly Accumulation</span>
                        <span className="text-cyan-400">2026</span>
                    </h3>
                    <div className="h-[300px] mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dummyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" stroke="#94A3B8" />
                                <YAxis stroke="#94A3B8" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="rain" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Anomaly Detection</h3>
                        <p className="text-sm text-text mt-4 leading-relaxed">
                            Current precipitation levels are <span className="text-red-400 font-bold -15%">15% below</span> the 10-year historical average for this month.
                            This marks the third consecutive month of deficit accumulation.
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="w-full bg-white/5 rounded-full h-4 mb-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-orange-400 h-4 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                            <span>Severe Deficit</span>
                            <span>Normal</span>
                            <span>Excess</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
