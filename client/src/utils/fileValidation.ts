/**
 * `handleFileChange` is a function that checks if the uploaded file type is supported.
 * If the file type is not supported, it sets an error message and sets the media type as not accepted.
 * If the file type is supported, it clears the error message and sets the media type as accepted.
 *
 * @param {Object} file - The uploaded file. It should have a `type` property.
 * @param {string | number} uploadType - The type required by the UploadInput (video, audio, pdf, image, etc).
 * @param {Function} setMediaTypeError - A function to set the error message.
 * @param {Function} setMediaTypeAccepted - A function to set whether the media type is accepted.
 */

const mediaTypes = {
  video: [
    'video/mp4',
    'video/x-matroska',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-flv',
    'video/mp2t',
    'video/mp2p',
    'application/mxf',
    'video/3gpp',
    'video/webm',
    'video/mpeg'
  ],
  audio: ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac'],
  pdf: ['application/pdf'],
  image: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
  document: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
};

const mediaTypesExtensions = {
  video: [
    'mp4',
    'mkv',
    'mov',
    'avi',
    'flv',
    'ts',
    'm2ts',
    'mxf',
    '3gp',
    'webm',
    'mpeg'
  ],
  audio: ['mp3', 'wav', 'ogg', 'aac'],
  pdf: ['pdf'],
  image: ['jpeg', 'png', 'jpg', 'gif'],
  document: ['doc', 'docx', 'odt', 'rtf', 'txt']
};

export const handleFileChange = (
  file: { type: any },
  uploadType: string | number,
  setMediaTypeError: (arg0: string) => void,
  setMediaTypeAccepted: (arg0: boolean) => void
) => {
  const fileSizeInGB =
    (file as { type: any; size: number }).size / (1024 * 1024 * 1024);
  if (!mediaTypes[uploadType as keyof typeof mediaTypes].includes(file.type)) {
    setMediaTypeError(
      `Unsupported ${uploadType} type. Supported files are: ` +
        mediaTypesExtensions[uploadType as keyof typeof mediaTypesExtensions]
          .join(', ')
          .toUpperCase()
    );
    setMediaTypeAccepted(false);
  } else if (fileSizeInGB > 2) {
    setMediaTypeError('File size should not exceed 2gb.');
    setMediaTypeAccepted(false);
  } else {
    setMediaTypeError('');
    setMediaTypeAccepted(true);
  }
};
