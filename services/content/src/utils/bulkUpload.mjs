import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

const endpointUrl = 'https://content-ztbavieh4q-pd.a.run.app';
const authToken = 'your_authorization_token';

// Replace with your actual default cover images map
const defaultCoverImages = {
  Artengine: 'https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/Artengine.jpg',
  '221A': 'https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/221a.jpg',
  'Agnes Etherington Art Centre': 'https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/AgnesEtheringtonArtCentre.jpg',
  'Morris and Helen Belkin Art Gallery':
    'https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/MorrisandHelenBelkinArtGallery.jpg',
  'Museum of Anthropology': 'https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/MuseumofAnthropology.jpg',
  TwoRiversGalleryBC: 'https://pub-7f4bf083e7344d06b67371aec183bddb.r2.dev/TwoRiversGallery.jpg'
};

// Replace with your actual map of organizations to profile IDs
const organizationProfileIds = {
  Artengine: 'd9ae2071-10d7-467d-9a40-cc591d2fb9cd',
  '221A': 'd230c768-66ca-43b7-bd1d-1939afb393e2',
  'Agnes Etherington Art Centre': '',
  'Morris and Helen Belkin Art Gallery': '',
  'Museum of Anthropology': '',
  TwoRiversGalleryBC: ''
};

const results = [];

fs.createReadStream('/Users/taylorjackson/Desktop/formatted2.csv')
  .pipe(csv())
  .on('data', (data) => {
    try {
      const coverData = JSON.parse(data['Cover Image']);
      const coverSrc = coverData[0]['cover-src'] || defaultCoverImages[data['Name of Organization']];
      const profileId = organizationProfileIds[data['Name of Organization']];
      const length = data['Length'];
      const desc = data['Description Formatted'];
      const title = data['Title'];
      const url = data['URL'];
      const artistUrl = data['Organizational Channel'];

      results.push({
        title: title,
        length: length,
        url: url,
        coverSrc: coverSrc,
        profileId: profileId,
        artistUrl: artistUrl,
        description: desc
      });
    } catch (error) {
      console.error('Error parsing data:', data, error);
    }
  })
  .on('end', () => {
    // // Map the data to the schema
    const addContentRequests = results.map(createAddContentRequest);
    console.log(addContentRequests);
  });

function createAddContentRequest(item) {
  return {
    profileId: item.profileId, // Assuming this comes from the CSV data
    type: ['link'], // You need to provide this
    externalUrl: item.url, // Assuming this comes from the CSV data
    title: item.title, // Assuming this comes from the CSV data
    description: item.description, // Assuming this comes from the CSV data
    coverImageExternalUrl: item.coverSrc, // You need to provide this
    bannerImageExternalUrl: item.coverSrc, // You need to provide this
    isSuitableForChildren: true, // or false, depending on your data
    coverImageText: 'Cover image description not available', // You need to provide this
    bannerImageText: 'Banner image description not available', // You need to provide this
    mediaLength: item.length, // Assuming this comes from the CSV data
    tags: ['artist talk', 'cultural teachings', 'discussion', 'exhibition', 'lecture'], // You need to provide this
    category: ['video', 'audio', 'link'], // You need to provide this

    contributors: {
      artist: [
        {
          url: item.artistUrl,
          name: 'Click here'
        }
      ]
    }, // You need to provide this

    expiry: 'your_default_expiry', // You need to provide this

    mediaFileId: 'your_default_mediaFileId', // You need to provide this
    vttFileId: 'your_default_vttFileId', // You need to provide this
    collaborators: ['default_collaborator'] // You need to provide this
  };
}
