const generateVTT = (transcript) => {
  let vttText = "WEBVTT\n\n";
  for (const key in transcript) {
    const { text, start, end } = transcript[key];
    const formatTime = (time) => {
      const hours = String(Math.floor(time / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
      const seconds = String(Math.floor((time % 3600) % 60)).padStart(2, "0");
      const milliseconds = String(Math.floor((time % 1) * 1000)).padStart(
        3,
        "0"
      );
      return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };
    const startFormatted = formatTime(start);
    const endFormatted = formatTime(end);
    vttText += `${startFormatted} --> ${endFormatted}\n`;
    vttText += `${text}\n\n`;
  }
  return vttText;
};

module.exports = {
  generateVTT,
};
