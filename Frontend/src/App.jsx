import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import ClientHome from "./pages/client/ClientHome";
import PostJob from "./pages/client/PostJob";
import MyJobs from "./pages/client/MyJobs";
import ClientChat from "./pages/client/ClientChat";

import FreelancerHome from "./pages/freelancer/FreelancerHome";
import Projects from "./pages/freelancer/Projects";
import Account from "./pages/freelancer/Account";
import FreelancerChat from "./pages/freelancer/FreelancerChat";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
                <Route path="/client/home" element={<ClientHome />} />
                <Route path="/client/post-job" element={<PostJob />} />
                <Route path="/client/my-jobs" element={<MyJobs />} />
                <Route path="/client/chat/:jobId" element={<ClientChat />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["freelancer"]} />}>
                <Route path="/freelancer/home" element={<FreelancerHome />} />
                <Route path="/freelancer/projects" element={<Projects />} />
                <Route path="/freelancer/account" element={<Account />} />
                <Route path="/freelancer/chat/:jobId" element={<FreelancerChat />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
