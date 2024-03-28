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
import Accessibility from './components/Screens/Accessibility';
import TOS from './components/Screens/TOS';
import Tags from './components/Screens/Tags';
import FormFooter from './components/FormFooter';
import { getProfileId } from 'utils/auth';
import { useLocation } from 'react-router-dom';
import LoadingCubes from 'assets/animations/loading-cubes.json';
import EventEmitter from 'events';
import { progressEmitter } from 'api/upload';
import UploadProgress from './components/Screens/UploadProgress';
import useContentDetails from 'hooks/useContentDetails';
import useContentDetailsByParam from 'hooks/useContentDetailsByParam';
import Lottie from 'lottie-react';
import { UpdateContentTypeEnum } from '@cubeca/cube-svc-client-oas-axios/dist/models/update-content';
import useAuth from 'hooks/useAuth';

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let contentId = queryParams.get('contentid');
  let id = queryParams.get('contentid');
  const { isLoggedIn } = useAuth();
  const {
    data: content,
    isLoading: isContentLoading,
    fetchContentDetails,
    refetch
  } = useContentDetailsByParam();

  const { tag } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, formState, watch } = useForm({
    mode: 'onChange',
    criteriaMode: 'all'
  });

  const {
    addContent,
    updateContent,

    isUploadLoading: isLoading,
    isUploadError: isError,
    isUploadSuccess: isSuccess,
    isUpdateSuccess,
    isUpdateError,
    isUpdateLoading,
    response
  } = useContent();
  const profileId = getProfileId();
  const topRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
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
  const [isQueryParamCheckComplete, setIsQueryParamCheckComplete] =
    useState(false);
  const [finalCollaborators, setFinalCollaborators] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState(
    editMode && content?.category ? content?.category : []
  );
  const [newCoverImageSelected, setNewCoverImageSelected] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if ((contentId || id) && profileId === content?.profileId) {
      setEditMode(true);
      contentId = queryParams.get('contentid');
      id = queryParams.get('contentid');
    }
    setIsQueryParamCheckComplete(true);
    // if not content owner, redirect to profile page
    // BUG: was trying to redirect to profile page if not content owner, but this was causing
    // clicking Upload to redirect to profile page
    // this is only an issue of a user manually entered the URL
    // with the query param to content that isn't theirs
    // if (profileId !== content?.profileId && !editMode) {
    //   navigate(`/profile/${tag}`);
    // }
  }, [id, contentId, location, isLoading, isContentLoading]);

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
    const collaborators = [profileId, ...finalCollaborators];
    const payload = {
      profileId: profileId!,
      title: values.title,
      type: editMode ? content?.type : values.type,
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
    };
    //@ts-ignore
    const coverImageUrl = content?.coverImageUrl?.id || '';
    const editPayload = {
      profileId: profileId!,
      title: values.title,
      type: content?.type as UpdateContentTypeEnum,
      expiry: values.expiry,
      category: selectedCategories,
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
        : [],
      //@ts-ignore
      mediaFileId: content?.mediaUrl?.id,
      //@ts-ignore
      vttFileId: content?.vttFileUrl?.id
    };

    if (!isCoverImageSelected) {
      //@ts-ignore
      editPayload.coverImageFileId = content?.coverImageUrl?.id;
    }

    if (!isBannerImageSelected) {
      //@ts-ignore
      editPayload.bannerImageFileId = content?.bannerImageUrl?.id;
    }

    if (editMode) {
      updateContent(id!, editPayload, coverImageFile!, bannerImageFile!);
    } else {
      addContent(
        payload,
        coverImageFile!,
        mediaFile!,
        vttFile!,
        bannerImageFile!
      );
    }
  };

  const SCREENS_BASE = [
    {
      label: 'Media',
      view: (
        <Media
          control={control}
          uploadType={!editMode ? mediaType : content?.type}
          handleMediaUpload={handleMediaUpload}
          handleCoverImageUpload={handleCoverImageUpload}
          handleBannerImageUpload={handleBannerImageUpload}
          setIsMediaProperFileType={setIsMediaProperFileType}
          setIsCoverImageProperFileType={setIsCoverImageProperFileType}
          setIsBannerImageProperFileType={setIsBannerImageProperFileType}
          editMode={editMode}
          content={content}
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
          editMode={editMode}
          content={content}
        />
      )
    },
    // {
    //   label: 'Accessibility',
    //   view: <Accessibility />
    // },
    {
      label: 'Tags',
      view: (
        <Tags
          handleCaptchaVerification={handleCaptchaVerification}
          control={control}
          editMode={editMode}
          content={content}
          setFinalCollaborators={setFinalCollaborators}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      )
    },
    {
      label: 'Terms of Service',
      view: <TOS />
    },
    {
      label: 'Upload',
      view: <UploadProgress editMode={editMode} />
    }
  ];

  const [SCREENS, setSCREENS] = useState(SCREENS_BASE);

  // leaving this logic here for now for when we bring the accessibility screen back
  // useEffect(() => {
  //   // @ts-ignore
  //   if (!['video', 'audio'].includes(mediaType)) {
  //     const tmpScreens = [...SCREENS_BASE];
  //     //remove accessibility screen
  //     tmpScreens.splice(2, 1);
  //     setSCREENS(tmpScreens);
  //   } else {
  //     setSCREENS(SCREENS_BASE);
  //   }
  // }, [mediaType]);

  useEffect(() => {
    setSCREENS(SCREENS_BASE);
  }, [mediaType]);

  const activeScreenView = SCREENS[screenIndex].view;

  useEffect(() => {
    if (editMode && isUpdateSuccess) {
      navigate(`/content/${id}?edit=true`);
    }
    if (isSuccess) {
      //@ts-ignore - idk why this is not working - we can see in the node_modules it is part of the spec....
      if (response.data.vttQueued && response?.data?.id) {
        //@ts-ignore
        navigate(`/subtitle-editor/${response?.data?.id}/true`);
      } else if (!vttEditorLaunched) {
        navigate(`/profile/${tag}`);
      } else if (editMode && isUpdateSuccess) {
        navigate(`/content/${id}`);
      }
    }
  }, [isSuccess, response, vttEditorLaunched, isUpdateSuccess]);

  if (isError) {
    console.log('Upload Error');
  }
  if ((id && isContentLoading) || !isQueryParamCheckComplete) {
    return (
      <Lottie
        className="loading-cubes"
        animationData={LoadingCubes}
        loop={true}
        autoplay={true}
        style={{ height: '500px' }}
      />
    );
  }

  return (
    <Box className={'upload'} ref={topRef}>
      <Breadcrumb editMode={editMode} />
      <Progress
        screens={SCREENS.map((x) => x.label)}
        screenIndex={screenIndex}
        onScreenIndexChange={handleScreenChange}
        editMode={editMode}
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
          editMode={editMode}
          isNextDisabled={
            editMode
              ? false
              : !formState.isValid ||
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
