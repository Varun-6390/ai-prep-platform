import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import interviewService from '../../../services/interview.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const QuestionGenerator = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('technical');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await interviewService.getReportById(id);
                setReport(data.interviewReport);
            } catch (err) {
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Generating your question bank..." />;
    }

    if (error || !report) {
        return (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl flex flex-col items-center space-y-md">
                <span className="material-symbols-outlined text-[48px]">error</span>
                <p className="font-h3 text-h3">{error || 'Questions not found.'}</p>
                <Link to="/dashboard/analysis/new" className="bg-primary text-on-primary px-lg py-sm rounded-full">Try Again</Link>
            </div>
        );
    }

    const currentQuestions = activeTab === 'technical' ? report.technicalQuestions : report.behavioralQuestions;

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
                <div>
                    <h1 className="font-h1 text-h1 text-on-surface">Question Bank</h1>
                    <p className="font-body-lg text-body-lg text-secondary mt-xs">Tailored practice scenarios for your target role.</p>
                </div>
                <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant">
                    <button 
                        onClick={() => setActiveTab('technical')}
                        className={`px-6 py-2 rounded-full font-button text-[14px] transition-all ${
                            activeTab === 'technical' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container-high'
                        }`}
                    >
                        Technical
                    </button>
                    <button 
                        onClick={() => setActiveTab('behavioral')}
                        className={`px-6 py-2 rounded-full font-button text-[14px] transition-all ${
                            activeTab === 'behavioral' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container-high'
                        }`}
                    >
                        Behavioral
                    </button>
                </div>
            </header>

            <div className="space-y-md">
                {currentQuestions?.map((item, index) => (
                    <QuestionCard key={index} question={item.question} intention={item.intention} answer={item.answer} />
                ))}
                {(!currentQuestions || currentQuestions.length === 0) && (
                    <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
                        <span className="material-symbols-outlined text-[64px] text-surface-container-highest mb-md">quiz</span>
                        <p className="font-body-lg text-secondary">No {activeTab} questions found for this report.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuestionCard = ({ question, intention, answer }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div 
                className="p-md flex items-start justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="space-y-sm flex-1">
                    <div className="flex items-center gap-xs text-primary font-label-caps text-[10px] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        Practice Question
                    </div>
                    <h4 className="font-h3 text-[18px] text-on-background leading-tight">{question}</h4>
                </div>
                <button className={`p-2 rounded-full hover:bg-surface-container-high transition-colors ${expanded ? 'rotate-180' : ''}`}>
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
            </div>
            
            {expanded && (
                <div className="px-md pb-md space-y-md animate-in slide-in-from-top-2 duration-300">
                    <div className="p-md bg-secondary-fixed text-on-secondary-fixed rounded-lg">
                        <p className="font-label-caps text-[10px] uppercase tracking-widest mb-xs opacity-70">The Intention</p>
                        <p className="font-body-sm italic">{intention}</p>
                    </div>
                    <div className="p-md bg-surface-container-low border border-outline-variant rounded-lg">
                        <p className="font-label-caps text-[10px] uppercase tracking-widest mb-xs text-primary">Suggested Answer Pattern</p>
                        <p className="font-body-md text-on-surface leading-relaxed">{answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionGenerator;
