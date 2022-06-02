import { Home, About, NotFound, Profile, Video } from 'pages';

import { Route, Routes } from 'react-router-dom';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/video/:id" element={<Video />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
