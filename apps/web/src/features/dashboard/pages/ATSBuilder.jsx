import React, { useState, useEffect } from 'react';
import interviewService from '../../../services/interview.service';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ATSBuilder = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);
    const [errorMap, setErrorMap] = useState({});

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await interviewService.getAllReports();
                setReports(data.interviewReports);
            } catch (err) {
                console.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleDownload = async (id) => {
        setDownloading(id);
        setErrorMap(prev => ({ ...prev, [id]: null }));
        try {
            const blob = await interviewService.downloadResume(id);

            // If backend returned an error JSON instead of a PDF blob
            if (blob.type === 'application/json') {
                const text = await blob.text();
                const json = JSON.parse(text);
                setErrorMap(prev => ({ ...prev, [id]: json.message || 'Failed to generate resume.' }));
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Optimized_Resume_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            setErrorMap(prev => ({ ...prev, [id]: 'Failed to download resume. Please try again.' }));
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading your resumes..." />;
    }

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header className="border-b border-outline-variant pb-md">
                <h1 className="font-h1 text-h1 text-on-surface">ATS Resume Builder</h1>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">Download AI-optimized, ATS-friendly versions of your resume.</p>
            </header>

            <div className="grid gap-md">
                {reports?.map((report) => (
                    <div key={report._id} className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-md">
                                <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <div>
                                    <h3 className="font-h3 text-[18px] text-on-surface font-bold">{report.title || 'Untitled Report'}</h3>
                                    <p className="font-body-sm text-secondary">
                                        {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(report._id)}
                                disabled={downloading === report._id}
                                className={`flex items-center gap-xs px-lg py-sm rounded-full font-button text-sm transition-all ${
                                    downloading === report._id
                                    ? 'bg-surface-container-high text-secondary cursor-not-allowed'
                                    : 'bg-primary text-on-primary hover:bg-primary/90'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {downloading === report._id ? 'sync' : 'download'}
                                </span>
                                {downloading === report._id ? 'Generating...' : 'Download PDF'}
                            </button>
                        </div>
                        {errorMap[report._id] && (
                            <div className="mt-sm flex items-start gap-xs p-sm bg-error-container rounded-lg">
                                <span className="material-symbols-outlined text-error text-[18px] mt-[1px]">error</span>
                                <p className="text-sm text-error font-medium">{errorMap[report._id]}</p>
                            </div>
                        )}
                    </div>
                ))}

                {(!reports || reports.length === 0) && (
                    <div className="text-center py-xl bg-surface border border-outline-variant rounded-xl">
                        <span className="material-symbols-outlined text-[64px] text-surface-container-highest mb-md">description</span>
                        <p className="font-body-lg text-secondary">No analyzed resumes found. Start a new analysis to generate optimized resumes.</p>
                    </div>
                )}
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md">
                <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">info</span>
                    <div>
                        <p className="text-sm font-semibold text-on-surface">Note on older reports</p>
                        <p className="text-sm text-secondary mt-xs">
                            Reports created before the latest update may have an issue with resume data. 
                            If you see an error, please run a new analysis with your resume — the updated system will correctly extract and store your resume text.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSBuilder;
