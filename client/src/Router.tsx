import { Home, About, NotFound, Profile, Content, Upload, Login, ResetPassword, ForgotPassword } from 'pages';


import { Navigate, Route, Routes } from 'react-router-dom';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/about" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile/:tag" element={<Profile />} />
      <Route path="/profile/:id/upload" element={<Upload />} />
      <Route path="/content/:id" element={<Content />} />
      <Route
        path="/verified"
        element={<Navigate to="/login?verified=true" />}
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
