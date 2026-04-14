import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectPage from "./pages/SubjectPage";
import TopicPage from "./pages/TopicPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TheoryPage from "./pages/TheoryPage";
import TestsPage from "./pages/TestsPage";
import ExamPage from "./pages/ExamPage";
import AdminPage from "./pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "theory", element: <TheoryPage /> },
      { path: "tests", element: <TestsPage /> },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify-otp", element: <VerifyOtpPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "exam", element: <ExamPage /> },
      { path: "admin", element: <AdminPage /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: "profile", element: <ProfilePage /> }],
      },

      { path: "subject/:slug", element: <SubjectPage /> },
      { path: "topic/:slug", element: <TopicPage /> },
      { path: "quiz/:slug", element: <QuizPage /> },
      { path: "result/:id", element: <ResultPage /> },
    ],
  },
]);