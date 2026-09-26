import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Link } from 'react-router';
import interviewService from '../../../services/interview.service';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await interviewService.getAllReports();
                setReports(data.interviewReports || []);
            } catch (err) {
                console.error("Failed to fetch reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const averageScore = reports.length > 0 
        ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / reports.length)
        : 0;

    return (
        <div className="max-w-container-max mx-auto space-y-md md:space-y-lg">
            {/* Page Title */}
            <div>
                <h1 className="font-h1 text-h1 text-on-surface">Welcome back, {user?.username || 'Alex'}.</h1>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">Here's your interview readiness overview for today.</p>
            </div>
            
            {/* Bento Grid First Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                {/* Readiness Radial Chart (Card 1) */}
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col col-span-1 min-h-[300px]">
                    <h3 className="font-h3 text-[20px] text-on-background mb-sm">Interview Readiness</h3>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        {/* Simple SVG Radial representation */}
                        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-surface-container-high" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                            <circle 
                                className="text-primary transition-all duration-1000" 
                                cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" 
                                strokeDasharray="251.2" 
                                strokeDashoffset={251.2 - (251.2 * (averageScore || 0)) / 100} 
                                strokeLinecap="round" strokeWidth="8"
                            ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-h2 text-h2 text-on-surface">{averageScore}%</span>
                            <span className="font-body-sm text-body-sm text-secondary">Overall Score</span>
                        </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-center text-secondary mt-sm">
                        {reports.length > 0 ? `Based on ${reports.length} recent analyses.` : 'Start your first analysis to see your score.'}
                    </p>
                </div>

                {/* Quick Actions (Card 2) */}
                <div className="bg-surface border border-outline-variant rounded-xl p-md shadow-sm flex flex-col col-span-1 lg:col-span-2">
                    <h3 className="font-h3 text-[20px] text-on-background mb-md">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md flex-1">
                        {/* Action: Upload Resume */}
                        <Link to="/dashboard/analysis/new" className="border-2 border-dashed border-primary-fixed-dim rounded-lg bg-surface-container-low flex flex-col items-center justify-center p-md text-center hover:bg-primary-fixed transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-sm group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px]" data-icon="upload_file">upload_file</span>
                            </div>
                            <span className="font-button text-button text-on-surface mb-xs">Analyze New Resume</span>
                            <span className="font-body-sm text-body-sm text-secondary">Upload PDF & get real-time ATS feedback</span>
                        </Link>
                        
                        {/* Action: Generate Questions */}
                        <Link to="/dashboard/analysis/new" className="border border-outline-variant rounded-lg bg-surface-container-lowest flex flex-col items-start justify-center p-md hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden">
                            <div className="absolute right-0 top-0 opacity-5 -translate-y-4 translate-x-4">
                                <span className="material-symbols-outlined text-[120px]" data-icon="psychology">psychology</span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-sm">
                                <span className="material-symbols-outlined text-[20px]" data-icon="auto_awesome">auto_awesome</span>
                            </div>
                            <span className="font-button text-button text-on-surface mb-xs">Mock Interview Prep</span>
                            <span className="font-body-sm text-body-sm text-secondary relative z-10">Generate questions & prep plans from any job post.</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-md border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-h3 text-[20px] text-on-background">Recent Activity</h3>
                    <button className="font-button text-button text-primary hover:text-primary-container">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-outline-variant">
                                <th className="py-3 px-md font-label-caps text-label-caps text-secondary font-medium">Activity Type</th>
                                <th className="py-3 px-md font-label-caps text-label-caps text-secondary font-medium">Report Title</th>
                                <th className="py-3 px-md font-label-caps text-label-caps text-secondary font-medium">Date</th>
                                <th className="py-3 px-md font-label-caps text-label-caps text-secondary font-medium">Score</th>
                            </tr>
                        </thead>
                        <tbody className="font-body-sm text-body-sm text-on-surface">
                            {reports.map((report) => (
                                <tr key={report._id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                                    <td className="py-4 px-md">
                                        <Link to={`/dashboard/analysis/${report._id}`} className="flex items-center gap-sm hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-secondary" data-icon="description">description</span>
                                            Resume Analysis
                                        </Link>
                                    </td>
                                    <td className="py-4 px-md truncate max-w-[200px]">{report.title || 'Untitled Report'}</td>
                                    <td className="py-4 px-md text-secondary">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-md">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium leading-none ${
                                            report.matchScore > 80 ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                                            report.matchScore > 50 ? 'bg-primary-fixed text-on-primary-fixed' :
                                            'bg-error-container text-on-error-container'
                                        }`}>
                                            {report.matchScore}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-secondary italic">
                                        No recent activity. Start by analyzing a resume!
                                    </td>
                                </tr>
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative flex items-center justify-center">
                                                <motion.div
                                                    className="w-10 h-10 rounded-full"
                                                    style={{ border: '2.5px solid transparent', borderTopColor: 'rgb(59, 130, 246)', borderRightColor: 'rgba(59, 130, 246, 0.3)' }}
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                                />
                                                <motion.span
                                                    className="absolute material-symbols-outlined text-blue-500 text-[18px]"
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                >auto_awesome</motion.span>
                                            </div>
                                            <span className="text-sm text-secondary">Loading activity...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
