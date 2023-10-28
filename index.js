import data from "./data.json" assert { type: "json" };

const messageInput = document.getElementById("messageInput");
const questionsList = document.getElementById("questionsList");
const sendButton = document.getElementById("send");

async function getResponse(prompt) {
  let options = {
    method: "POST",
    url: "https://hkust.azure-api.net/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15",
    headers: {
      "Content-Type": "application/json",
      "api-key": data.apikey,
    },
    data: prompt,
  };

  const response = await axios.request(options);

  // const response = await fetch(
  //   "https://hkust.azure-api.net/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "api-key": data.apikey,
  //       "Access-Control-Allow-Origin": "https://hkust.azure-api.net",
  //     },
  //     body: JSON.stringify(prompt),
  //   }
  // );
  return response.json();
}

async function sendMessage(e) {
  const question = messageInput.value;
  messageInput.value = "";
  const prompt = {
    model: "gpt-35-turbo",
    message: [
      {
        role: "system",
        content: "you are an assistant",
      },
      { role: "user", content: question },
    ],
  };
  const response = await getResponse(prompt);
  console.log(response);
}

sendButton.addEventListener("click", sendMessage);

// async function sendMessage() {
//   const message = messageInput.value;
//   messageInput.value = "";
//   const response = await generateResponse(message);
//   const messageElement = document.createElement("div");
//   messageElement.innerText = `You: ${message}`;
//   chatbox.appendChild(messageElement);
//   const responseElement = document.createElement("div");
//   responseElement.innerText = `GPT: ${response}`;
//   chatbox.appendChild(responseElement);
//   const questionElement = document.createElement("li");
//   questionElement.innerText = message;
//   questionsList.appendChild(questionElement);
//   return false;
// }
