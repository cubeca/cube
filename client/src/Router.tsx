// import { Home, About, NotFound, Profile, Video, Upload } from 'pages';
import { Home, About, NotFound, Profile, Video} from 'pages';

import { Navigate, Route, Routes } from 'react-router-dom';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile/:id" element={<Profile />} />
      {/* <Route path="/profile/:id/upload" element={<Upload />} /> */}
      <Route path="/videos/:id" element={<Video />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
