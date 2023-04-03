import { Box } from '@mui/material';
import useContent from 'hooks/useContent';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import Progress from './components/Progress';
import Screens from './components/Screens';
import Media from './components/Screens/Media';
import Details from './components/Screens/Details';
import Accessibility from './components/Screens/Accessibility';
import Tags from './components/Screens/Tags';
import FormFooter from './components/FormFooter';

const Upload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm();
  const {
    addContent,
    isUploadLoading: isLoading,
    isUploadError: isError,
    isUploadSuccess: isSuccess
  } = useContent({});

  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [transcriptFile, setTranscriptFile] = useState<File>();
  const [subtitlesFile, setSubtitlesFile] = useState<File>();
  const [expiryValue, setExpiryValue] = useState<dateFns | null>(null);
  const [screenIndex, setScreenIndex] = useState(0);

  // const { data: collaborators, isLoading: isCollaboratorsLoading } =
  //   useCollaborators();

  const handleCoverImageUpload = (files: File[]) => {
    setCoverImageFile(files[0]);
  };

  const handleMediaUpload = (files: File[]) => {
    setMediaFile(files[0]);
  };

  const handleTranscriptUpload = (files: File[]) => {
    setTranscriptFile(files[0]);
  };

  const handleSubtitlesUpload = (files: File[]) => {
    setSubtitlesFile(files[0]);
  };

  const onSubmit = (values: FieldValues) => {
    addContent(
      {
        profileId: id!,
        title: values.title,
        type: values.type,
        expiry: values.expiry,
        description: values.description,
        coverImageText: values.imageText,
        collaborators: [values.collaborators],
        contributors: [values.contributors],
        tags: [values.tags]
      },
      coverImageFile!,
      mediaFile!,
      transcriptFile!,
      subtitlesFile!
    );
  };

  const SCREENS = [
    {
      label: 'Media',
      view: (
        <Media
          control={control}
          handleMediaUpload={handleMediaUpload}
          handleCoverImageUpload={handleCoverImageUpload}
        />
      )
    },
    {
      label: 'Details',
      view: (
        <Details
          control={control}
          handleTranscriptUpload={handleTranscriptUpload}
          handleSubtitlesUpload={handleSubtitlesUpload}
          expiryValue={expiryValue}
          onExpriryValueChange={setExpiryValue}
        />
      )
    },
    {
      label: 'Accessibility',
      view: <Accessibility />
    },
    {
      label: 'Tags',
      view: <Tags control={control} />
    }
  ];

  const activeScreenView = SCREENS[screenIndex].view;

  if (isSuccess) {
    navigate(`/profile/${id!}`);
  }

  if (isError) {
    console.log('Error Uploading');
  }

  return (
    <Box className={'upload'}>
      <Breadcrumb />
      <Progress
        screens={SCREENS.map((x) => x.label)}
        screenIndex={screenIndex}
        onScreenIndexChange={setScreenIndex}
      />
      <Screens screen={activeScreenView} />
      <FormFooter
        isLoading={isLoading}
        screens={SCREENS.map((x) => x.label)}
        screenIndex={screenIndex}
        onScreenIndexChange={setScreenIndex}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default Upload;
