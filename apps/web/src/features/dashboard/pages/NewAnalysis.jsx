import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import interviewService from '../../../services/interview.service';

const NewAnalysis = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobDescription) {
            setError('Please provide both a resume and a job description.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('jobDescription', jobDescription);
            formData.append('selfDescription', selfDescription);

            const result = await interviewService.generateReport(formData);
            if (result.interviewReport?._id) {
                navigate(`/dashboard/analysis/${result.interviewReport._id}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-container-max mx-auto space-y-lg">
            <header>
                <h1 className="font-h1 text-h1 text-on-surface dark:text-white transition-colors duration-200">New Analysis</h1>
                <p className="font-body-lg text-body-lg text-secondary dark:text-slate-400 mt-xs transition-colors duration-200">
                    Get real-time feedback on your resume's ATS compatibility and generate custom interview questions.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                {/* Left Column: Upload */}
                <div className="space-y-md">
                    <div className="bg-surface dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl p-md shadow-sm transition-colors duration-200">
                        <h3 className="font-h3 text-[20px] text-on-background dark:text-white mb-md">1. Upload Resume</h3>
                        <label 
                            className={`border-2 border-dashed rounded-lg p-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                                file ? 'border-primary bg-primary-fixed dark:bg-primary/20' : 'border-outline-variant dark:border-slate-600 hover:bg-surface-container-low dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-md ${
                                file ? 'bg-primary text-on-primary' : 'bg-surface-container-high dark:bg-slate-700 text-secondary dark:text-slate-400'
                            }`}>
                                <span className="material-symbols-outlined text-[32px]">
                                    {file ? 'check_circle' : 'upload_file'}
                                </span>
                            </div>
                            {file ? (
                                <div>
                                    <p className="font-button text-button text-on-surface dark:text-white">{file.name}</p>
                                    <p className="font-body-sm text-body-sm text-secondary dark:text-slate-400">Click to change file</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-button text-button text-on-surface dark:text-white">Click to upload or drag & drop</p>
                                    <p className="font-body-sm text-body-sm text-secondary dark:text-slate-400">Only PDF files are supported</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="bg-surface dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl p-md shadow-sm transition-colors duration-200">
                        <h3 className="font-h3 text-[20px] text-on-background dark:text-white mb-md">2. Tell us about yourself (Optional)</h3>
                        <textarea
                            className="w-full bg-surface-container-low dark:bg-slate-900/50 border border-outline-variant dark:border-slate-600 rounded-lg p-md font-body-md text-body-md dark:text-white focus:outline-none focus:border-primary min-h-[120px] transition-colors duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Briefly describe your career goals or any specific areas you want to highlight..."
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Right Column: Job Description */}
                <div className="space-y-md flex flex-col">
                    <div className="bg-surface dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-xl p-md shadow-sm flex-1 flex flex-col transition-colors duration-200">
                        <h3 className="font-h3 text-[20px] text-on-background dark:text-white mb-md">3. Target Job Description</h3>
                        <textarea
                            className="w-full bg-surface-container-low dark:bg-slate-900/50 border border-outline-variant dark:border-slate-600 rounded-lg p-md font-body-md text-body-md dark:text-white focus:outline-none focus:border-primary flex-1 min-h-[300px] transition-colors duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Paste the full job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-error-container text-on-error-container p-md rounded-lg flex items-center gap-sm">
                            <span className="material-symbols-outlined">error</span>
                            <span className="font-body-sm">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-md rounded-full font-button text-button transition-all flex items-center justify-center gap-sm ${
                            loading 
                            ? 'bg-surface-container-highest text-secondary cursor-not-allowed' 
                            : 'bg-primary text-on-primary hover:shadow-lg active:scale-95 hover:bg-primary-container'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing Data...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">auto_awesome</span>
                                Start AI Analysis
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewAnalysis;
