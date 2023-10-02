import { Box } from '@mui/material';
import useContent from 'hooks/useContent';
import { useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import Progress from './components/Progress';
import Screens from './components/Screens';
import Media from './components/Screens/Media';
import Details from './components/Screens/Details';
import Accessibility from './components/Screens/Accessibility';
import TOS from './components/Screens/TOS';
import Tags from './components/Screens/Tags';
import FormFooter from './components/FormFooter';
import { getProfileId } from 'utils/auth';

const getContributors = (values: FieldValues) => {
  const contributors: string[] = [];
  const keys = Object.keys(values);

  keys.forEach((key) => {
    switch (key) {
      case 'artist':
        contributors.push(`artist:${values[key]}`);
        break;
      case 'camera':
        if (values[key]) contributors.push(`camera:${values[key]}`);
        break;
      case 'sound':
        if (values[key]) contributors.push(`sound:${values[key]}`);
        break;
      case 'editor':
        if (values[key]) contributors.push(`editor:${values[key]}`);
        break;
      case 'other_role':
        if (values['other_role'] && values['other_name'])
          contributors.push(`${values['other_role']}:${values['other_name']}`);
        break;
    }

    if (key.includes('other_role_')) {
      const index = key.split('_')[2];
      if (values[key] && values[`other_name_${index}`])
        contributors.push(`${values[key]}:${values[`other_name_${index}`]}`);
    }
  });

  return contributors;
};

const Upload = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    criteriaMode: 'all'
  });

  const {
    addContent,
    isUploadLoading: isLoading,
    isUploadError: isError,
    isUploadSuccess: isSuccess
  } = useContent();
  const profileId = getProfileId();
  const topRef = useRef(null);

  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [expiryValue, setExpiryValue] = useState<dateFns | null>(null);
  const [VTTFiles, setVTTFiles] = useState<File[]>([]);
  const [screenIndex, setScreenIndex] = useState(0);
  const [isCoverImageSelected, setIsCoverImageSelected] = useState(false);
  const [isMediaSelected, setIsMediaSelected] = useState(false);
  const [isVTTSelected, setIsVTTSelected] = useState(false);
  const [formValues, setFormValues] = useState(getValues());

  useEffect(() => {
    setFormValues(getValues());
  }, [formState]);

  // const { data: collaborators, isLoading: isCollaboratorsLoading } =
  //   useCollaborators();

  const handleCoverImageUpload = (files: File[]) => {
    setCoverImageFile(files[0]);
    setIsCoverImageSelected(true);
  };

  const handleMediaUpload = (files: File[]) => {
    setMediaFile(files[0]);
    setIsMediaSelected(true);
  };

  const handleVTTFilesUpload = (files: File[]) => {
    setVTTFiles(files);
    setIsVTTSelected(true);
  };

  const handleScreenChange = (screen: number) => {
    setScreenIndex(screen);
    (topRef?.current as unknown as HTMLElement)?.scrollIntoView();
  };

  const onSubmit = (values: FieldValues) => {
    console.log(values);
    const contributors = getContributors(values);
    addContent(
      {
        profileId: profileId!,
        title: values.title,
        type: values.type,
        expiry: values.expiry,
        description: values.description,
        coverImageText: values.imageText,
        collaborators: [values.collaborators],
        contributors,
        tags: [values.tags]
      },
      coverImageFile!,
      mediaFile!
    );
  };

  const SCREENS_BASE = [
    {
      label: 'Media',
      view: (
        <Media
          control={control}
          uploadType={formValues.type}
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
          uploadType={formValues.type}
          handleVTTFilesUpload={handleVTTFilesUpload}
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
    },
    {
      label: 'Terms of Service',
      view: <TOS />
    }
  ];
  const [SCREENS, setSCREENS] = useState(SCREENS_BASE);

  useEffect(() => {
    // @ts-ignore
    if (!['video'].includes(formValues.type)) {
      const tmpScreens = [...SCREENS_BASE];
      //remove accessibility screen
      tmpScreens.splice(2, 1);
      setSCREENS(tmpScreens);
    } else {
      setSCREENS(SCREENS_BASE);
    }
  }, [formValues.type]);

  const activeScreenView = SCREENS[screenIndex].view;

  if (isSuccess) {
    navigate(`/profile/${tag}`);
  }

  if (isError) {
    console.log('Upload Error');
  }

  return (
    <Box className={'upload'} ref={topRef}>
      <Breadcrumb />
      <Progress
        screens={SCREENS.map((x) => x.label)}
        screenIndex={screenIndex}
        onScreenIndexChange={handleScreenChange}
        isNextDisabled={
          !formState.isValid ||
          (screenIndex === 0 && (!isCoverImageSelected || !isMediaSelected)) ||
          (screenIndex === 1 && !isVTTSelected)
        }
      />
      <Screens screen={activeScreenView} />
      <FormFooter
        isLoading={isLoading}
        screens={SCREENS.map((x) => x.label)}
        screenIndex={screenIndex}
        onScreenIndexChange={handleScreenChange}
        handleSubmit={handleSubmit(onSubmit)}
        isNextDisabled={
          !formState.isValid ||
          (screenIndex === 0 && !isCoverImageSelected) ||
          (!formValues.link && !isMediaSelected) ||
          (screenIndex === 1 && !isVTTSelected && formValues.type === 'video')
        }
      />
    </Box>
  );
};

export default Upload;
