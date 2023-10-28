import data from "./data.json" assert { type: "json" };

const messageInput = document.getElementById("messageInput");
const responseElement = document.getElementById("response");
const histroyElement = document.getElementById("history");
const sendButton = document.getElementById("send");

const { transcript, apikey } = data;
const gptContext = `You are an university instructor teaching a course on software engineering. You presented the following speech in the lecture: "${transcript}"`;
const openAIURL =
  "https://hkust.azure-api.net/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15";

/* generate prompt for GPT */
function generatePrompt(msg) {
  const question = `A student in the lecture asked: "${msg}". How do you respond?`;

  const prompt = {
    model: "gpt-35-turbo",
    messages: [
      {
        role: "system",
        content: gptContext,
      },
      { role: "user", content: question },
    ],
  };
  return prompt;
}

function waiting() {
  responseElement.innerText = `Please wait for a while...`;
}

/* send request to GPT */
async function sendRequest(prompt) {
  let openAIRequest = {
    url: openAIURL,
    method: "POST",
    data: JSON.stringify(prompt),
    headers: {
      "Content-Type": "application/json",
      "api-key": apikey,
      "Cache-Control": "no-cache",
    },
  };

  // use proxy to avoid CORS issue
  let proxyRequest = {
    method: "POST",
    url: "https://cors-proxy1.p.rapidapi.com/v1",
    headers: {
      "content-type": "application/json",
      "x-rapidapi-host": "cors-proxy1.p.rapidapi.com",
      "x-rapidapi-key": "6b365f6db2mshf7c7b122917d7d8p104b18jsn706a31e92355",
    },
    data: openAIRequest,
  };

  const response = await axios.request(proxyRequest);

  return response;
}

/* parse response from GPT */
function parseResponse(response) {
  response = JSON.parse(response.data.text);
  const ans = response.choices[0].message.content;
  return ans;
}

/* display response and update history */
function displayResponseAndUpdateHistory(question, ans) {
  responseElement.innerText = `TA: ${ans}`;

  const QElement = document.createElement("p");
  QElement.innerText = `Q: ${question}`;
  QElement.style.fontWeight = "bold";

  const AElement = document.createElement("p");
  AElement.innerText = `A: ${ans}`;

  const QAElement = document.createElement("div");
  QAElement.appendChild(QElement);
  QAElement.appendChild(AElement);

  histroyElement.appendChild(QAElement);
  histroyElement.appendChild(document.createElement("hr"));
}

async function sendMessage(e) {
  waiting();

  const question = messageInput.value;
  const prompt = generatePrompt(question);
  console.log(prompt);

  let response = await sendRequest(prompt);

  const ans = parseResponse(response);
  displayResponseAndUpdateHistory(question, ans);

  return true;
}

sendButton.addEventListener("click", sendMessage);
