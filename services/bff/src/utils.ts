import { cloudflareApi } from "microservices";

export const inspect = (...things: any) =>
  things.forEach((thing: any) =>
    console.dir(thing, { depth: null, color: true })
  );

export const filterObject = (obj:any, ...allowedKeys:string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([key, _]: [key: string, _: any]) => allowedKeys.includes(key)));

  export const getFiles = async (fileIds: string[]) => {
    const files: { [k: string]: any } = {};
    const errors: any[] = [];
  
    // Filter out empty or falsy values from fileIds array
    const filteredFileIds = fileIds.filter((fileId) => !!fileId);
  
    // Perform API requests concurrently using Promise.all
    const apiRequests = filteredFileIds.map((fileId) =>
      cloudflareApi.get(`files/${fileId}`).then(({ status, data }) => {
        if (status === 200) {
          files[fileId] = data;
        } else {
          errors.push({ fileId, status, data });
        }
      }).catch((error) => {
        errors.push({ fileId, error });
      })
    );
  
    // Wait for all the API requests to finish
    await Promise.all(apiRequests);
    return { files, errors };
  };
  

  export const transformContentListForProfile = async (profile: any, contentList: any[]) => {
    const fieldNames = {
      coverImageFileId: 'coverImageUrl',
      mediaFileId: 'mediaUrl',
      subtitlesFileId: 'subtitlesUrl',
      transcriptFileId: 'transcriptUrl'
    };
  
    const fileIds = contentList.flatMap(content => Object.values(fieldNames).map(fieldName => content[fieldName])).filter(Boolean);
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
  
    const contentByCategory = contentList.reduce((acc, content) => {
      const { category } = content;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(content);
      return acc;
    }, {});
  
    return Object.entries(contentByCategory).map(([category, content]) => ({ category, content }));
  };