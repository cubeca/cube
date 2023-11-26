import { Box } from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';
import VTTEditor from './components/Editor/Editor';
import { Grid } from '@mui/material';

const SubtitleEditor = () => {
  const { id, postUpload } = useParams();
  console.log({ id, postUpload });

  return (
    <Box className={'subtitleEditor'}>
      <VTTEditor contentId={id} postUpload={postUpload} />
    </Box>
  );
};

export default SubtitleEditor;
