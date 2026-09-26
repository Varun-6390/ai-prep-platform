import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./features/dashboard/pages/Dashboard";
import NewAnalysis from "./features/dashboard/pages/NewAnalysis";
import ResumeAnalysis from "./features/dashboard/pages/ResumeAnalysis";
import QuestionGenerator from "./features/dashboard/pages/QuestionGenerator";
import PreparationPlan from "./features/dashboard/pages/PreparationPlan";
import ATSBuilder from "./features/dashboard/pages/ATSBuilder";
import AiInterviewLandingPage from "./features/auth/pages/AiInterviewLandingPage";


export const router = createBrowserRouter([

    {
        path: "/",
        element: <AiInterviewLandingPage />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: <Protected><DashboardLayout /></Protected>,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "analysis/new",
                element: <NewAnalysis />
            },
            {
                path: "analysis/:id",
                element: <ResumeAnalysis />
            },
            {
                path: "questions/:id",
                element: <QuestionGenerator />
            },
            {
                path: "prep-plan/:id",
                element: <PreparationPlan />
            },
            {
                path: "ats",
                element: <ATSBuilder />
            }
        ]
    }
])