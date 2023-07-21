import { cloudflareApi } from "microservices";

export const filterObject = (obj: any, ...allowedKeys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));

export const transformContentListForProfile = async (profile: any, contentList: any[]) => {
  const fieldNames = {
    coverImageFileId: 'coverImageUrl',
    mediaFileId: 'mediaUrl',
    subtitlesFileId: 'subtitlesUrl',
    transcriptFileId: 'transcriptUrl'
  };

  const fileIds = [];
  for (const content of contentList) {
    for (const fileIdFieldName of Object.keys(fieldNames)) {
      if (content[fileIdFieldName]) {
        fileIds.push(content[fileIdFieldName]);
      }
    }
  }

  const { files } = await getFiles(fileIds);

  for (const content of contentList) {
    for (const [fileIdFieldName, urlFieldName] of Object.entries(fieldNames)) {
      if (content[fileIdFieldName] && files[content[fileIdFieldName]]) {
        const file = files[content[fileIdFieldName]];

        // Videos have both, `dashUrl` or `hlsUrl`. TBD Which one works better for FE?
        const url = file.playerInfo.publicUrl ? file.playerInfo.publicUrl : file.playerInfo.dashUrl;

        content[urlFieldName] = url;
      }
    }

    content.creator = profile.organization;
    content.iconUrl = profile.logoUrl;

    // TODO Remove hack after migrating existing content to add `category` field.
    if (!content.category) {
      content.category = content.type;
    }
  }

  const contentByCategory: { [k: string]: any[] } = {};
  for (const content of contentList) {
    if (!contentByCategory[content.category]) {
      contentByCategory[content.category] = [];
    }
    contentByCategory[content.category].push(content);
  }

  return Object.entries(contentByCategory).map(([category, content]) => ({ category, content }));
};