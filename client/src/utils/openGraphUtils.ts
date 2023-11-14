import axios from 'axios';

export async function getOpenGraphData(url: string) {
  if (url.startsWith('https://')) {
    // only run if URL is https and not http or file://

    let html;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      html = response.data;
    } catch (error) {
      console.error('Failed to fetch html: ', error);
      return { title: '', description: '', image: '' };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const titleElement =
      doc.querySelector('meta[property="og:title"]') ||
      doc.querySelector('title');
    const title = titleElement
      ? titleElement.getAttribute('content') || titleElement.textContent
      : '';

    const descriptionElement =
      doc.querySelector('meta[property="og:description"]') ||
      doc.querySelector('meta[name="description"]');
    const description = descriptionElement
      ? descriptionElement.getAttribute('content')
      : '';

    const imageElement =
      doc.querySelector('meta[property="og:image"]') ||
      doc.querySelector('link[rel="shortcut icon"]');
    const image = imageElement
      ? imageElement.getAttribute('content') ||
        imageElement.getAttribute('href')
      : '';

    return { title, description, image };
  } else {
    return { title: '', description: '', image: '' };
  }
}
