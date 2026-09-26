import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import interviewService from '../../../services/interview.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ResumeAnalysis = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await interviewService.getReportById(id);
                setReport(data.interviewReport);
            } catch (err) {
                setError('Failed to load analysis results.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Loading your analysis..." />;
    }

    if (error || !report) {
        return (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl flex flex-col items-center space-y-md">
                <span className="material-symbols-outlined text-[48px]">error</span>
                <p className="font-h3 text-h3">{error || 'Analysis not found.'}</p>
                <Link to="/dashboard/analysis/new" className="bg-primary text-on-primary px-lg py-sm rounded-full">Try Again</Link>
            </div>
        );
    }

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-md">
                <div>
                    <h1 className="font-h1 text-h1 text-on-surface">{report.title || 'Resume Analysis'}</h1>
                    <p className="font-body-lg text-body-lg text-secondary mt-xs">Target Role Analysis & ATS Optimization Suggestions</p>
                </div>
                <div className="flex gap-sm">
                    <Link to={`/questions/${id}`} className="bg-surface-container-high text-on-surface px-md py-sm rounded-full font-button flex items-center gap-xs hover:bg-surface-container-highest transition-colors">
                        <span className="material-symbols-outlined text-[20px]">psychology</span>
                        Practice Questions
                    </Link>
                    <Link to={`/prep-plan/${id}`} className="bg-primary text-on-primary px-md py-sm rounded-full font-button flex items-center gap-xs hover:bg-primary-container transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">checklist_rtl</span>
                        Preparation Plan
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                {/* Score Card */}
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-md">Overall Match Score</h3>
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-surface-container-high" cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" />
                            <circle 
                                className="text-primary transition-all duration-1000 ease-out" 
                                cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" 
                                strokeDasharray="251.2" 
                                strokeDashoffset={251.2 - (251.2 * report.matchScore) / 100} 
                                strokeLinecap="round" 
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="font-h1 text-[48px] text-on-surface leading-none">{report.matchScore}%</span>
                            <span className="font-label-caps text-secondary">Optimized</span>
                        </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary mt-md">
                        {report.matchScore > 80 ? 'Excellent match! Your resume is highly optimized for this role.' : 
                         report.matchScore > 50 ? 'Good start, but there are critical keywords missing.' : 
                         'Significant gaps detected. Follow the AI suggestions below.'}
                    </p>
                </div>

                {/* Skill Gaps */}
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm col-span-1 lg:col-span-2">
                    <div className="flex items-center gap-sm mb-md">
                        <span className="material-symbols-outlined text-error" data-icon="warning">warning</span>
                        <h3 className="font-h3 text-[20px] text-on-background">Critical Skill Gaps</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                        {report.skillGaps?.map((gap, index) => (
                            <div key={index} className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg border border-outline-variant">
                                <span className="font-body-md text-on-surface">{gap.skill}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold uppercase tracking-wider ${
                                    gap.severity === 'high' ? 'bg-error-container text-on-error-container' :
                                    gap.severity === 'medium' ? 'bg-secondary-container text-on-secondary-container' :
                                    'bg-surface-container-highest text-secondary'
                                }`}>
                                    {gap.severity}
                                </span>
                            </div>
                        ))}
                        {(!report.skillGaps || report.skillGaps.length === 0) && (
                            <p className="text-secondary font-body-sm italic">No significant gaps detected. Great job!</p>
                        )}
                    </div>
                </div>

                {/* AI Suggestions (Full Width) */}
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm lg:col-span-3">
                    <div className="flex items-center gap-sm mb-md">
                        <span className="material-symbols-outlined text-primary" data-icon="smart_toy">smart_toy</span>
                        <h3 className="font-h3 text-[20px] text-on-background">AI Coach Suggestions</h3>
                    </div>
                    <div className="space-y-md">
                        {/* We'll use some generic advice if the backend doesn't provide specific suggestion list, 
                            but in our model it might be part of skill gaps or preparation plan. 
                            Let's add a few static ones if empty based on common ATS advice */}
                        <div className="flex gap-md p-md bg-primary-fixed rounded-lg border border-primary-fixed-dim">
                            <span className="material-symbols-outlined text-primary">lightbulb</span>
                            <div>
                                <p className="font-button text-button text-on-surface mb-xs">Quantify Your Achievements</p>
                                <p className="font-body-sm text-on-surface-variant">
                                    Instead of "Managed a team," use "Led a cross-functional team of 8 engineers to deliver 3 high-impact projects 2 weeks ahead of schedule."
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant">
                            <span className="material-symbols-outlined text-secondary">lightbulb</span>
                            <div>
                                <p className="font-button text-button text-on-surface mb-xs">Improve Section Headers</p>
                                <p className="font-body-sm text-on-surface-variant">
                                    Ensure your section headers (Experience, Education, Skills) are standard so ATS systems can parse them correctly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalysis;
