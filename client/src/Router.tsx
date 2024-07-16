import {
  Home,
  Search,
  NotFound,
  Profile,
  Content,
  EditAndUpload,
  Login,
  ResetPassword,
  ForgotPassword,
  EmbeddedContent,
  SubtitleEditor,
  Playlist,
  User,
  EmbeddedPlaylist
} from 'pages';
import ReactivateProfile from 'pages/ReactivateProfile';

import { Navigate, Route, Routes } from 'react-router-dom';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reactivate-profile" element={<ReactivateProfile />} />
      <Route path="/profile/:tag" element={<Profile />} />
      <Route path="/profile/:tag/upload" element={<EditAndUpload />} />
      <Route path="/content/:id" element={<Content />} />
      <Route path="/playlist/:id" element={<Playlist />} />
      <Route path="/user/:id" element={<User />} />
      <Route
        path="/subtitle-editor/:id/:postUpload?"
        element={<SubtitleEditor />}
      />
      <Route path="/embed/:id" element={<EmbeddedContent />} />
      <Route path="/embedPlaylist/:playlistId" element={<EmbeddedPlaylist />} />
      <Route
        path="/verified"
        element={<Navigate to="/login?verified=true" />}
      />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
