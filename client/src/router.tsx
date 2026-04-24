import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import MistakesPage from "./pages/MistakesPage";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SubjectPage from "./pages/SubjectPage";
import TopicPage from "./pages/TopicPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyLoginOtpPage from "./pages/VerifyLoginOtpPage";
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
      {
  path: "/mistakes",
  element: <MistakesPage />
},
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "verify-login-otp", element: <VerifyLoginOtpPage /> },

      { path: "exam", element: <ExamPage /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: "profile", element: <ProfilePage /> }],
      },

      {
        element: <ProtectedRoute adminOnly />,
        children: [{ path: "admin", element: <AdminPage /> }],
      },

      { path: "subject/:slug", element: <SubjectPage /> },
      { path: "topic/:slug", element: <TopicPage /> },
      { path: "quiz/:slug", element: <QuizPage /> },
      { path: "result/:id", element: <ResultPage /> },
    ],
  },
]);