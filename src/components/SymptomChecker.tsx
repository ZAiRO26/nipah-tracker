import { useState } from 'react';

export default function SymptomChecker() {
    const [step, setStep] = useState(0);
    const [risk, setRisk] = useState<string | null>(null);

    const reset = () => {
        setStep(0);
        setRisk(null);
    };

    const handleYes = () => {
        if (step === 0) setStep(1); // Fever -> Travel
        else if (step === 1) setRisk('high'); // Travel -> High Risk
    };

    const handleNo = () => {
        if (step === 0) setRisk('low'); // No Fever -> Low Risk
        else if (step === 1) setRisk('medium'); // Fever but No Travel -> Medium Risk
    };

    if (risk) {
        return (
            <div className={`p-6 rounded-xl border ${risk === 'high' ? 'bg-red-50 border-red-200' :
                    risk === 'medium' ? 'bg-orange-50 border-orange-200' :
                        'bg-green-50 border-green-200'
                }`}>
                <h3 className={`text-xl font-bold mb-2 ${risk === 'high' ? 'text-red-800' :
                        risk === 'medium' ? 'text-orange-800' :
                            'text-green-800'
                    }`}>
                    {risk === 'high' ? 'High Risk - Action Required' :
                        risk === 'medium' ? 'Monitor Symptoms' :
                            'Low Risk'}
                </h3>
                <p className="text-slate-700 mb-4">
                    {risk === 'high' ? 'Please isolate immediately and call the helpline. Do not visit a hospital without calling first.' :
                        risk === 'medium' ? 'Stay hydrated and monitor your temperature. If symptoms worsen, consult a doctor.' :
                            'You do not appear to have Nipah symptoms. Maintain hygiene.'}
                </p>
                {risk === 'high' && (
                    <a href="tel:104" className="block w-full text-center bg-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition">
                        Call 104 Now
                    </a>
                )}
                <button onClick={reset} className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline">
                    Check Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-6">
                <div className="flex gap-2 mb-4">
                    <div className={`h-1 flex-1 rounded-full ${step >= 0 ? 'bg-red-600' : 'bg-slate-200'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-red-600' : 'bg-slate-200'}`}></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {step === 0 ? 'Do you have a fever AND headache/cough?' : 'Have you visited Kerala or West Bengal recently?'}
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={handleNo} className="py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition">
                    No
                </button>
                <button onClick={handleYes} className="py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-sm transition">
                    Yes
                </button>
            </div>
        </div>
    );
}
