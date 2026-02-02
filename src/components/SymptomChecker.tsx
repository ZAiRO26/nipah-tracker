import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { languageStore } from '../stores/languageStore';
import { translations } from '../i18n/translations';

export default function SymptomChecker() {
    const language = useStore(languageStore);
    const t = translations[language].checker;

    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    const questions = [
        { text: t.question_fever, points: 2 },
        { text: t.question_headache, points: 1 },
        { text: t.question_contact, points: 5 }, // High risk factor
        { text: t.question_breath, points: 3 },
    ];

    const handleAnswer = (yes: boolean) => {
        if (yes) setScore(s => s + questions[step].points);

        if (step < questions.length - 1) {
            setStep(s => s + 1);
        } else {
            calculateRisk(score + (yes ? questions[step].points : 0));
        }
    };

    const calculateRisk = (finalScore: number) => {
        let riskMessage = '';
        let colorClass = '';

        if (finalScore >= 5) {
            riskMessage = t.result_high;
            colorClass = 'bg-red-100 text-red-800 border-red-200';
        } else if (finalScore >= 2) {
            riskMessage = t.result_moderate;
            colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        } else {
            riskMessage = t.result_low;
            colorClass = 'bg-green-100 text-green-800 border-green-200';
        }
        setResult(riskMessage);
    };

    const reset = () => {
        setStep(0);
        setScore(0);
        setResult(null);
    };

    if (result) {
        return (
            <div className={`p-6 rounded-xl border ${result.includes(t.result_high) ? 'bg-red-50 border-red-200' : result.includes(t.result_moderate) ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <h3 className="font-bold text-lg mb-2">{t.title} Result</h3>
                <p className="mb-4 font-medium">{result}</p>
                <button
                    onClick={reset}
                    className="w-full py-2 px-4 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                    {t.btn_reset}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex justify-between items-center">
                <span>{t.title}</span>
                <span className="text-xs font-normal text-slate-500">Step {step + 1}/{questions.length}</span>
            </h3>

            <div className="mb-6">
                <p className="text-lg font-medium text-slate-800">{questions[step].text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleAnswer(false)}
                    className="py-3 px-4 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                    {t.btn_no}
                </button>
                <button
                    onClick={() => handleAnswer(true)}
                    className="py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold shadow-sm"
                >
                    {t.btn_yes}
                </button>
            </div>
        </div>
    );
}
