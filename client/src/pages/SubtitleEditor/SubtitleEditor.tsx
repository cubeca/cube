import { Box } from '@mui/material';

import { useParams } from 'react-router-dom';
import VTTEditor from './components/Editor/Editor';

const SubtitleEditor = () => {
  const { id, postUpload } = useParams();

  return (
    <Box className={'subtitleEditor'}>
      <VTTEditor contentId={id} postUpload={postUpload} />
    </Box>
  );
};

export default SubtitleEditor;
