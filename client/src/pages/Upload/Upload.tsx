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
  const contributors: { type: string; contributors: string[] }[] = [];
  const keys = Object.keys(values);

  keys.forEach((key) => {
    if (key === 'other_role') {
      if (values['other_role'] && values['other_name']) {
        contributors.push({
          type: values['other_role'],
          contributors: [values['other_name']]
        });
      }
    } else if (key.includes('other_role_')) {
      const index = key.split('_')[2];
      if (values[key] && values[`other_name_${index}`]) {
        contributors.push({
          type: values[key],
          contributors: [values[`other_name_${index}`]]
        });
      }
    } else if (key in contributors) {
      if (values[key]) {
        const valuesArray = values[key]
          .split(',')
          .map((value: string) => value.trim());
        contributors.push({ type: key, contributors: valuesArray });
      }
    } else if (
      key === 'artist' ||
      key === 'camera' ||
      key === 'editor' ||
      key === 'sound'
    ) {
      if (values[key]) {
        const valuesArray = values[key]
          .split(',')
          .map((value: string) => value.trim());
        contributors.push({ type: key, contributors: valuesArray });
      }
    }
  });

  return contributors;
};
const Upload = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, formState, getValues, watch } = useForm({
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
  const [bannerImageFile, setBannerImageFile] = useState<File>();
  const [expiryValue, setExpiryValue] = useState<dateFns | null>(null);
  const [VTTFiles, setVTTFiles] = useState<File[]>([]);
  const [screenIndex, setScreenIndex] = useState(0);
  const [isCoverImageSelected, setIsCoverImageSelected] = useState(false);
  const [isBannerImageSelected, setIsBannerImageSelected] = useState(false);
  const [isMediaSelected, setIsMediaSelected] = useState(false);
  const [isVTTSelected, setIsVTTSelected] = useState(false);

  const mediaType = watch('type');
  const mediaLink = watch('link');

  const handleCoverImageUpload = (files: File[]) => {
    setCoverImageFile(files[0]);
    setIsCoverImageSelected(true);
  };

  const handleMediaUpload = (files: File[]) => {
    setMediaFile(files[0]);
    setIsMediaSelected(true);
  };

  const handleBannerImageUpload = (files: File[]) => {
    setBannerImageFile(files[0]);
    setIsBannerImageSelected(true);
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
    const contributorsObject: { [key: string]: string[] } = {};
    contributors.forEach(({ type, contributors }) => {
      contributorsObject[type] = contributors;
    });

    const formattedContributors: { [key: string]: string[] } = {};
    Object.entries(contributorsObject).forEach(([key, value]) => {
      formattedContributors[key] = value
        .join(',')
        .split(',')
        .map((contributor: string) => contributor.trim());
    });

    addContent(
      {
        profileId: profileId!,
        title: values.title,
        type: values.type,
        expiry: values.expiry,
        description: values.description,
        coverImageText: values.imageText,
        collaborators: [values.collaborators],
        contributors: formattedContributors,
        tags: values.tags.split(',').map((tag: string) => tag.trim()),
        externalUrl: values.link ? values.link : null,
        isSuitableForChildren: values.kidsContent
      },
      coverImageFile!,
      mediaFile!,
      bannerImageFile!
    );
  };

  const SCREENS_BASE = [
    {
      label: 'Media',
      view: (
        <Media
          control={control}
          uploadType={mediaType}
          handleMediaUpload={handleMediaUpload}
          handleCoverImageUpload={handleCoverImageUpload}
          handleBannerImageUpload={handleBannerImageUpload}
        />
      )
    },
    {
      label: 'Details',
      view: (
        <Details
          control={control}
          uploadType={mediaType}
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
    if (!['video', 'audio'].includes(mediaType)) {
      const tmpScreens = [...SCREENS_BASE];
      //remove accessibility screen
      tmpScreens.splice(2, 1);
      setSCREENS(tmpScreens);
    } else {
      setSCREENS(SCREENS_BASE);
    }
  }, [mediaType]);

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
          (!mediaLink && !isMediaSelected) ||
          (screenIndex === 1 &&
            !isVTTSelected &&
            mediaType in ['video', 'audio'])
        }
      />
    </Box>
  );
};

export default Upload;
