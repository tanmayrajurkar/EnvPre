import { useState } from 'react';
import { getPrediction } from '../api';

function getAqiLabel(aqi: number) {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400' };
    if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: 'text-orange-400' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400' };
    return { label: 'Very Unhealthy', color: 'text-purple-400' };
}

function getRainLabel(prob: number) {
    if (prob < 20) return { label: 'Very unlikely', color: 'text-slate-400' };
    if (prob < 40) return { label: 'Unlikely', color: 'text-cyan-400' };
    if (prob < 60) return { label: 'Possible', color: 'text-blue-400' };
    if (prob < 80) return { label: 'Likely', color: 'text-indigo-400' };
    return { label: 'High likelihood', color: 'text-violet-400' };
}

export const MLAnalytics = () => {
    const [pastAqi1, setPastAqi1] = useState<number>(65);
    const [pastAqi2, setPastAqi2] = useState<number>(72);
    const [temp, setTemp] = useState<number>(28);
    const [precip, setPrecip] = useState<number>(5);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<{ predicted_aqi: number; predicted_rain_prob_percent: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getPrediction(pastAqi1, pastAqi2, temp, precip);
            setPrediction(result);
        } catch (e: any) {
            setError(e?.response?.data?.detail || e?.message || 'Prediction failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const aqiLabel = prediction ? getAqiLabel(prediction.predicted_aqi) : null;
    const rainLabel = prediction ? getRainLabel(prediction.predicted_rain_prob_percent) : null;

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 inline-block">
                    Predictive Analytics Engine
                </h1>
                <p className="text-muted mt-2">RandomForest ML inference — real predictions from the Python backend.</p>
            </header>

            {error && (
                <div className="glass-panel p-4 border border-red-500/30 text-red-400 rounded-xl">⚠ {error}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Parameters Panel */}
                <div className="glass-panel p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-lg font-semibold mb-6">Inference Parameters</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">Base AQI (t-1)</label>
                                <input type="number" value={pastAqi1} onChange={e => setPastAqi1(Number(e.target.value))}
                                    className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">Base AQI (t-2)</label>
                                <input type="number" value={pastAqi2} onChange={e => setPastAqi2(Number(e.target.value))}
                                    className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted mb-2">Avg Temp (°C)</label>
                                <input type="number" value={temp} onChange={e => setTemp(Number(e.target.value))}
                                    className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted mb-2">Precipitation (mm)</label>
                                <input type="number" value={precip} onChange={e => setPrecip(Number(e.target.value))}
                                    className="w-full bg-card/50 border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-card/30 border border-white/5 text-xs text-muted space-y-1">
                        <p className="font-semibold text-text mb-2">Model Architecture</p>
                        <p>• <span className="text-emerald-400">AQI Regressor</span>: RandomForest (100 trees, synthetic training)</p>
                        <p>• <span className="text-cyan-400">Rain Classifier</span>: RandomForest (100 trees, precipitation threshold)</p>
                        <p>• <span className="text-blue-400">Features</span>: AQI[t-1], AQI[t-2], Temperature, Precipitation</p>
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading}
                        className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-600 font-semibold text-white shadow-lg hover:shadow-emerald-500/25 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Running Inference...
                            </>
                        ) : 'Execute Model'}
                    </button>
                </div>

                {/* Results Panel */}
                <div className={`glass-panel p-6 flex flex-col justify-center items-center min-h-[300px] transition-all duration-500 ${prediction && !loading ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                    {!prediction && !loading && (
                        <div className="text-center text-muted">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <p>Awaiting model execution parameters.</p>
                            <p className="text-xs mt-2 opacity-60">Fill in values and click "Execute Model"</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-emerald-400 font-medium animate-pulse">Computing predictive vectors...</p>
                        </div>
                    )}

                    {prediction && !loading && (
                        <div className="w-full">
                            <h3 className="text-center text-lg font-semibold mb-8 text-emerald-400">Prediction Results</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card/50 rounded-xl p-5 border border-white/5 text-center">
                                    <div className="text-muted text-xs uppercase tracking-wider mb-2">Predicted AQI</div>
                                    <div className={`text-4xl font-bold ${aqiLabel?.color}`}>
                                        {prediction.predicted_aqi}
                                    </div>
                                    <div className={`text-xs mt-2 ${aqiLabel?.color}/70`}>{aqiLabel?.label}</div>
                                </div>
                                <div className="bg-card/50 rounded-xl p-5 border border-white/5 text-center">
                                    <div className="text-muted text-xs uppercase tracking-wider mb-2">Rain Probability</div>
                                    <div className={`text-4xl font-bold ${rainLabel?.color}`}>
                                        {prediction.predicted_rain_prob_percent}%
                                    </div>
                                    <div className={`text-xs mt-2 ${rainLabel?.color}/70`}>{rainLabel?.label}</div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 rounded-xl bg-card/30 border border-white/5">
                                <p className="text-xs text-muted text-center">
                                    Predictions computed via Python RandomForest models trained on synthetic environmental data.
                                    Inputs: AQI[t-1]={pastAqi1}, AQI[t-2]={pastAqi2}, Temp={temp}°C, Precip={precip}mm
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
