import { useState } from 'react';

export const MLAnalytics = () => {
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<{ aqi: number, rainProb: number } | null>(null);

    const handlePredict = () => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setPrediction({
                aqi: 72,
                rainProb: 84.5
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 inline-block">Predictive Analytics Engine</h1>
                <p className="text-muted mt-2">Machine learning inference utilizing RandomForest models for environmental forecasting.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Input Parameters Panel */}
                <div className="glass-panel p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-lg font-semibold mb-6">Inference Parameters</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-muted mb-2">Location/City Vector</label>
                            <input type="text" defaultValue="New York, US" className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">Base AQI (t-1)</label>
                                <input type="number" defaultValue={65} className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">Avg Temp (°C)</label>
                                <input type="number" defaultValue={22} className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading}
                        className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 font-semibold text-white shadow-lg hover:shadow-emerald-500/25 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Running Inference...
                            </>
                        ) : "Execute Model"}
                    </button>
                </div>

                {/* Results Panel */}
                <div className={`glass-panel p-6 flex flex-col justify-center items-center min-h-[300px] transition-all duration-500 ${prediction && !loading ? 'opacity-100 transform translate-y-0' : 'opacity-50 transform translate-y-4'}`}>
                    {!prediction && !loading && (
                        <div className="text-center text-muted">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            <p>Awaiting model execution parameters.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-emerald-400 font-medium animate-pulse">Computing predictive vectors...</p>
                        </div>
                    )}

                    {prediction && !loading && (
                        <div className="w-full">
                            <h3 className="text-center text-lg font-semibold mb-8 text-emerald-400">7-Day Forecast Results</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card/50 rounded-xl p-4 border border-white/5 text-center">
                                    <div className="text-muted text-xs uppercase tracking-wider mb-2">Predicted AQI Max</div>
                                    <div className="text-4xl font-bold text-yellow-400">{prediction.aqi}</div>
                                    <div className="text-xs text-yellow-400/70 mt-2">Moderate Risk</div>
                                </div>
                                <div className="bg-card/50 rounded-xl p-4 border border-white/5 text-center">
                                    <div className="text-muted text-xs uppercase tracking-wider mb-2">Rain Probability</div>
                                    <div className="text-4xl font-bold text-blue-400">{prediction.rainProb}%</div>
                                    <div className="text-xs text-blue-400/70 mt-2">High likelihood</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
