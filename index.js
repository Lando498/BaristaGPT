require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/baristagpt-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/baristagpt-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/baristagpt-ping - Check bot latency
/baristagpt-catfact - Get a cat fact`
  });
});
app.command("/baristagpt-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/baristagpt-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/baristagpt-coffee", async ({ ack, respond }) => {
  await ack();

  try {
    await respond({
      response_type: "in_channel", // This allows everyone in the channel to see it
      text: "Here's an image of coffee", 
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Here's an image of coffee ☕"
          }
        },
        {
          type: "image",
          image_url: "https://coffee.alexflipnote.dev/O-slTEy4DNY_coffee.jpg",
          alt_text: "Coffee Image"
        }
      ]
    });
  } catch (err) {
    // Keep error messages ephemeral (private) so they don't spam the channel
    await respond({ 
      response_type: "ephemeral", 
      text: "Failed to display the coffee image." 
    });
  }
});

