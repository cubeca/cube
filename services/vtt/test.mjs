import { transcribe_handler } from "./index.js"; // replace './index.js' with the path to your index.js file

// now you can use transcribe_handler in this file

const simulateEvent = {
  // const { contentID, tries } = JSON.parse(
  //   Buffer.from(event.data.message.data, "base64").toString()
  // ); /
  data: {
    message: {
      data: Buffer.from(
        JSON.stringify({
          contentID: "af28a192-7999-43fa-a5ce-193b700eaaa6",
          tries: 26,
        })
      ).toString("base64"),
    },
  },
};
const main = async () => {
  const result = await transcribe_handler(simulateEvent);
  console.log(result);
};

main();
