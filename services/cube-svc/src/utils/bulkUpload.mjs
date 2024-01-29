import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

const endpointUrl = 'https://content-ztbavieh4q-pd.a.run.app/content';
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJDVUJFIiwic3ViIjoiNjYzOWI2NjYtZTg5MC00ZGZkLTk5NjQtNmM4NzgyYjY1NzMzIiwiYXVkIjpbImFub255bW91cyIsImNvbnRlbnRFZGl0b3IiLCJhY3RpdmUiXSwiaWF0IjoxNzAxNDU0NDA3LCJleHAiOjE3MDE3MTM2MDd9.sNAlrGX3OShhEzAcwhk8UEqPwkLVlhaWTS4iJqmuBkc';

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
  'Agnes Etherington Art Centre': '3b19d661-eeac-4985-aef1-2cf8f2dccd72',
  'Morris and Helen Belkin Art Gallery': '2b29fc0e-3f48-4464-8ba7-88e064800829',
  'Museum of Anthropology': '203e5d9c-7721-4df1-84ef-c73983320c3b',
  TwoRiversGalleryBC: '2d2d6055-f35a-48de-a9b7-ccd69325ed05'
};

const results = [];

fs.createReadStream('/Users/taylorjackson/Desktop/formatted.csv')
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

      if (profileId === '2d2d6055-f35a-48de-a9b7-ccd69325ed05') {
        results.push({
          title: title,
          length: length,
          url: url,
          coverSrc: coverSrc,
          profileId: profileId,
          artistUrl: artistUrl,
          description: desc
        });
      }
    } catch (error) {
      console.error('Error parsing data:', data, error);
    }
  })
  .on('end', () => {
    // // Map the data to the schema
    const addContentRequests = results.map(createAddContentRequest);
    let i = 0;
    addContentRequests.forEach((contentRequest) => {
      axios
        .post(endpointUrl, contentRequest, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          console.log('Success: ');
          i++;
          console.log(i);
        })
        .catch((error) => {
          console.error('Error:', error.response.data);
        });
    });
  });

function createAddContentRequest(item) {
  return {
    profileId: item.profileId, // Assuming this comes from the CSV data
    type: 'link', // You need to provide this
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
    collaborators: [item.profileId], // You need to provide this

    contributors: {
      artist: [
        {
          url: item.artistUrl,
          name: 'Click here'
        }
      ]
    }
  };
}
