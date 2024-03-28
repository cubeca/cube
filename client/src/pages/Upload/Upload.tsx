import { Box, Typography } from '@mui/material';
import useContent from 'hooks/useContent';
import { useEffect, useRef, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import Progress from './components/Progress';
import Screens from './components/Screens';
import Media from './components/Screens/Media';
import Details from './components/Screens/Details';
import TOS from './components/Screens/TOS';
import Tags from './components/Screens/Tags';
import FormFooter from './components/FormFooter';
import { getProfileId } from 'utils/auth';
import * as s from './components/Screens/UploadProgress.styled';
import UploadProgress from './components/Screens/UploadProgress';
import { useTranslation } from 'react-i18next';

const getContributors = (values: FieldValues) => {
  const contributorsObject: {
    [key: string]: { name: string; url?: string; preferredTitle?: string }[];
  } = {};

  // Handle 'artist' role
  for (let i = 0; values[`artistName${i}`] !== undefined; i++) {
    if (values[`artistName${i}`] !== '') {
      if (!contributorsObject['artist']) {
        contributorsObject['artist'] = [];
      }
      contributorsObject['artist'].push({
        name: values[`artistName${i}`],
        url: values[`artistUrl${i}`],
        preferredTitle:
          values[`preferredTitle`] !== 'Artist'
            ? values[`preferredTitle`]
            : undefined
      });
    }
  }

  // Handle 'editor' role
  for (let i = 0; values[`editorName${i}`] !== undefined; i++) {
    if (!contributorsObject['editor']) {
      contributorsObject['editor'] = [];
    }
    if (values[`editorName${i}`] !== '' && values[`editorUrl${i}`] !== '') {
      contributorsObject['editor'].push({
        name: values[`editorName${i}`],
        url: values[`editorUrl${i}`]
      });
    }
  }
  if (contributorsObject['editor'].length === 0) {
    delete contributorsObject['editor'];
  }

  // Handle 'camera_operator' role
  for (let i = 0; values[`cameraOperatorName${i}`] !== undefined; i++) {
    if (!contributorsObject['camera_operator']) {
      contributorsObject['camera_operator'] = [];
    }
    if (
      values[`cameraOperatorName${i}`] !== '' &&
      values[`cameraOperatorUrl${i}`] !== ''
    ) {
      contributorsObject['camera_operator'].push({
        name: values[`cameraOperatorName${i}`],
        url: values[`cameraOperatorUrl${i}`]
      });
    }
  }
  if (contributorsObject['camera_operator'].length === 0) {
    delete contributorsObject['camera_operator'];
  }

  // Handle 'sound_technician' role
  for (let i = 0; values[`soundTechnicianName${i}`] !== undefined; i++) {
    if (!contributorsObject['sound_technician']) {
      contributorsObject['sound_technician'] = [];
    }
    if (
      values[`soundTechnicianName${i}`] !== '' &&
      values[`soundTechnicianUrl${i}`] !== ''
    ) {
      contributorsObject['sound_technician'].push({
        name: values[`soundTechnicianName${i}`],
        url: values[`soundTechnicianUrl${i}`]
      });
    }
  }
  if (contributorsObject['sound_technician'].length === 0) {
    delete contributorsObject['sound_technician'];
  }

  // Handle 'other' roles
  for (let i = 0; values[`other_name_${i}`] !== undefined; i++) {
    const role = values[`other_role_${i}`] || 'other';
    if (!contributorsObject[role]) {
      contributorsObject[role] = [];
    }
    if (values[`other_name_${i}`] !== '' && values[`other_role_${i}`] !== '') {
      contributorsObject[role].push({ name: values[`other_name_${i}`] });
    }
  }
  Object.keys(contributorsObject).forEach((key) => {
    if (contributorsObject[key].length === 0) {
      delete contributorsObject[key];
    }
  });

  return contributorsObject;
};

const Upload = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, formState, watch } = useForm({
    mode: 'onChange',
    criteriaMode: 'all'
  });

  const {
    addContent,
    isUploadLoading: isLoading,
    isUploadError: isError,
    isUploadSuccess: isSuccess,
    response
  } = useContent();
  const profileId = getProfileId();
  const topRef = useRef(null);

  const [coverImageFile, setCoverImageFile] = useState<File>();
  const [mediaFile, setMediaFile] = useState<File>();
  const [bannerImageFile, setBannerImageFile] = useState<File>();
  const [expiryValue, setExpiryValue] = useState<dateFns | null>(null);
  const [vttFile, setVTTFile] = useState<File>();
  const [screenIndex, setScreenIndex] = useState(0);
  const [isCoverImageSelected, setIsCoverImageSelected] = useState(false);
  const [isBannerImageSelected, setIsBannerImageSelected] = useState(false);
  const [isMediaSelected, setIsMediaSelected] = useState(false);
  const [isMediaProperFileType, setIsMediaProperFileType] = useState(false);
  const [isCoverImageProperFileType, setIsCoverImageProperFileType] =
    useState(false);
  const [isBannerImageProperFileType, setIsBannerImageProperFileType] =
    useState(false);
  const [isVTTSelected, setIsVTTSelected] = useState(false);
  const [vttEditorLaunched, setVTTEditorLaunched] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { t } = useTranslation();

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
    setVTTFile(files[0]);
    setIsVTTSelected(true);
  };

  const handleCaptchaVerification = () => {
    setCaptchaVerified(true);
  };

  const handleScreenChange = (screen: number) => {
    setScreenIndex(screen);
    (topRef?.current as unknown as HTMLElement)?.scrollIntoView();
  };

  const onSubmit = (values: FieldValues) => {
    const contributors = getContributors(values);
    const collaborators = [profileId, values.collaborators];
    addContent(
      {
        profileId: profileId!,
        title: values.title,
        type: values.type,
        expiry: values.expiry,
        category: values.categories,
        description: values.description,
        coverImageText: values.imageText,
        bannerImageText: values.bannerImageText,
        collaborators: collaborators,
        contributors: contributors,
        tags: values.tags.split(',').map((tag: string) => tag.trim()),
        languageTags: values.languageTags
          .split(',')
          .map((tag: string) => tag.trim()),
        externalUrl: values.link ? values.link : null,
        embedToggleEnabled: values.embedToggleInput,
        isSuitableForChildren: values.audience
          ? values.audience === 'yeskids'
          : false,
        embedContentWhitelist: values.embedContentWhitelist
          ? values.embedContentWhitelist
              .split(',')
              .map((tag: string) => tag.trim())
          : []
        // vttLanguage: values.vttLanguage ? values.vttLanguage : null
      },
      coverImageFile!,
      mediaFile!,
      vttFile!,
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
          setIsMediaProperFileType={setIsMediaProperFileType}
          setIsCoverImageProperFileType={setIsCoverImageProperFileType}
          setIsBannerImageProperFileType={setIsBannerImageProperFileType}
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
      label: 'Tags',
      view: (
        <Tags
          handleCaptchaVerification={handleCaptchaVerification}
          control={control}
        />
      )
    },
    {
      label: 'Terms of Service',
      view: <TOS />
    },
    {
      label: 'Upload',
      view: <UploadProgress />
    }
  ];
  const [SCREENS, setSCREENS] = useState(SCREENS_BASE);

  useEffect(() => {
    setSCREENS(SCREENS_BASE);
  }, [mediaType]);

  const activeScreenView = SCREENS[screenIndex].view;

  useEffect(() => {
    if (isSuccess) {
      //@ts-ignore - idk why this is not working - we can see in the node_modules it is part of the spec....
      if (response.data.vttQueued && response?.data?.id) {
        //@ts-ignore
        navigate(`/subtitle-editor/${response?.data?.id}/true`);
      } else if (!vttEditorLaunched) {
        navigate(`/profile/${tag}`);
      }
    }
  }, [isSuccess, response, vttEditorLaunched]);

  return isError ? (
    <s.ModalContainer>
      <s.ModalTitle variant="h1">{t('Uploading Failed')}</s.ModalTitle>
      <Typography variant="body2" sx={{ paddingBottom: '24px' }}>
        We encountered an error while uploading your content. Please try again
        later.
      </Typography>
    </s.ModalContainer>
  ) : (
    <Box className={'upload'} ref={topRef}>
      <Breadcrumb />
      <Progress
        screens={SCREENS.map((x) => x.label)}
        screenIndex={screenIndex}
        onScreenIndexChange={handleScreenChange}
        isNextDisabled={
          !formState.isValid ||
          (screenIndex === 0 && !isMediaProperFileType) ||
          (screenIndex === 0 &&
            mediaType === ('video' || 'audio' || 'pdf' || 'document') &&
            !isMediaProperFileType) ||
          (screenIndex === 0 &&
            mediaType === 'link' &&
            !isBannerImageProperFileType) ||
          (screenIndex === 0 && !isCoverImageProperFileType) ||
          (screenIndex === 0 && (!isCoverImageSelected || !isMediaSelected)) ||
          (screenIndex === 1 && !isVTTSelected) ||
          vttEditorLaunched
        }
      />
      <Screens screen={activeScreenView} />
      {vttEditorLaunched ? null : (
        <FormFooter
          isLoading={isLoading}
          screens={SCREENS.map((x) => x.label)}
          screenIndex={screenIndex}
          onScreenIndexChange={handleScreenChange}
          handleSubmit={handleSubmit(onSubmit)}
          isNextDisabled={
            !formState.isValid ||
            (screenIndex === 0 &&
              mediaType === ('video' || 'audio' || 'pdf' || 'document') &&
              !isMediaProperFileType) ||
            (screenIndex === 0 &&
              mediaType === 'link' &&
              !isBannerImageProperFileType) ||
            (screenIndex === 0 && !isCoverImageProperFileType) ||
            (screenIndex === 2 && !captchaVerified) ||
            (screenIndex === 0 && !isCoverImageSelected) ||
            (!mediaLink && !isMediaSelected) ||
            (screenIndex === 1 &&
              !isVTTSelected &&
              mediaType in ['video', 'audio'])
          }
        />
      )}
    </Box>
  );
};

export default Upload;
