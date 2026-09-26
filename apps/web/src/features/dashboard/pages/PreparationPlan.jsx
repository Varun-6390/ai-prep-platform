import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import interviewService from '../../../services/interview.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const PreparationPlan = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');
    const [checkedTasks, setCheckedTasks] = useState(new Set());

    const toggleTask = (dayIndex, taskIndex) => {
        const taskId = `${dayIndex}-${taskIndex}`;
        const newCheckedTasks = new Set(checkedTasks);
        if (newCheckedTasks.has(taskId)) {
            newCheckedTasks.delete(taskId);
        } else {
            newCheckedTasks.add(taskId);
        }
        setCheckedTasks(newCheckedTasks);
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await interviewService.getReportById(id);
                setReport(data.interviewReport);
            } catch (err) {
                setError('Failed to load preparation plan.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Mapping your roadmap..." />;
    }

    if (error || !report) {
        return (
            <div className="bg-error-container text-on-error-container p-lg rounded-xl flex flex-col items-center space-y-md">
                <span className="material-symbols-outlined text-[48px]">error</span>
                <p className="font-h3 text-h3">{error || 'Plan not found.'}</p>
                <Link to="/dashboard/analysis/new" className="bg-primary text-on-primary px-lg py-sm rounded-full">Try Again</Link>
            </div>
        );
    }

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header className="border-b border-outline-variant pb-md">
                <h1 className="font-h1 text-h1 text-on-surface">Interview Preparation Roadmap</h1>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">A day-by-day guide to mastering the target role.</p>
            </header>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-outline-variant hidden md:block"></div>

                <div className="space-y-xl md:pl-12">
                    {report.preparationPlan?.map((day, index) => (
                        <div key={index} className="relative">
                            {/* Day Marker */}
                            <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-button text-[12px] shadow-sm hidden md:flex">
                                {index + 1}
                            </div>
                            
                            <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm mb-md">
                                    <div>
                                        <h3 className="font-h3 text-[20px] text-on-background">{day.day}</h3>
                                        <p className="font-label-caps text-secondary text-[10px] uppercase tracking-widest">{day.focus}</p>
                                    </div>
                                    <div className="flex items-center gap-xs px-3 py-1 bg-surface-container-high rounded-full">
                                        <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                                        <span className="font-body-sm text-[12px] font-medium">~2-3 hours</span>
                                    </div>
                                </div>

                                <div className="space-y-sm">
                                    <h4 className="font-button text-button text-on-surface">Action Items:</h4>
                                    <ul className="space-y-sm">
                                        {day.tasks?.map((task, taskIdx) => {
                                            const taskId = `${index}-${taskIdx}`;
                                            const isChecked = checkedTasks.has(taskId);
                                            return (
                                                <li key={taskIdx} className="flex items-start gap-sm p-sm bg-surface-container-lowest border border-outline-variant rounded-lg">
                                                    <div 
                                                        onClick={() => toggleTask(index, taskIdx)}
                                                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                                                            isChecked 
                                                                ? 'bg-primary border-primary text-on-primary' 
                                                                : 'border-outline hover:border-primary'
                                                        }`}
                                                    >
                                                        {isChecked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                                                    </div>
                                                    <span className={`font-body-md flex-1 transition-all ${isChecked ? 'text-secondary line-through' : 'text-on-surface-variant'}`}>
                                                        {task}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {(!report.preparationPlan || report.preparationPlan.length === 0) && (
                        <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
                            <span className="material-symbols-outlined text-[64px] text-surface-container-highest mb-md">event_note</span>
                            <p className="font-body-lg text-secondary">No preparation plan found for this report.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreparationPlan;
