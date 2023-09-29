const fs = require('fs');

// Read the contents of the "tos.txt" file
const data = fs.readFileSync('tos.txt', 'utf8');

const headingPattern = /^\d+\.\s.+/gm;
const headings = data.match(headingPattern);

const lastUpdated = data.match(/Last updated: (.+)\./)[1];
const sections = [];
for (let i = 0; i < headings.length - 1; i++) {
  const start = data.indexOf(headings[i]) + headings[i].length;
  const end = data.indexOf(headings[i + 1]);
  if (start >= 0 && end >= 0) {
    let textBetweenHeadings = data.substring(start, end).trim();
    //remove all newlines
    textBetweenHeadings = textBetweenHeadings.replace(/\n/g, ' ');
    const sectionName = headings[i].replace(/\d+\.\s/g, '');
    const sectionNumber = headings[i].replace(/\.\s.+/g, '');

    const sectionRegex =
      /(\d+\.\d+)\.\s+([^:]+):\s+([\s\S]+?)(?=(?:\d+\.\d+\.|$))/g;
    const subSections = [];
    let match;
    // console.log({ textBetweenHeadings });
    while ((match = sectionRegex.exec(textBetweenHeadings))) {
      const subSectionNumber = match[1];
      const subSectionName = match[2];
      const subSectionBody = match[3].trim();

      const subSection = {
        subSectionNumber,
        subSectionName,
        subSectionBody
      };
      subSections.push(subSection);
    }

    sections.push({ sectionNumber, sectionName, subSections });
  }
}

let html = '<h3>Last Updated: ' + lastUpdated + '</h3>';
sections.forEach((section) => {
  html += '<h4>' + section.sectionNumber + '. ' + section.sectionName + '</h4>';
  section.subSections.forEach((subSection) => {
    html +=
      '<h5>' +
      subSection.subSectionNumber +
      '. ' +
      subSection.subSectionName +
      '</h5>';
    html += '<p>' + subSection.subSectionBody + '</p>';
  });
});

fs.writeFileSync('tos.html', html);
