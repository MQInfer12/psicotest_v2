import { openai } from "./openai.js";
import fs from "fs";

const fileResponse = await openai.files.content("file-X7MQRiA3Vfi9bNsLdHH4ML");
const fileContents = await fileResponse.text();

const lines = fileContents.split("\n");

for (const line of lines) {
  if (line.trim() === "") continue;
  try {
    const json = JSON.parse(line);
    console.log(json.response.body.choices[0].message.content);
    //create a txt file and save it with the name of json_response.txt
    const fileName = `json_response_${json.response.id}.txt`;
    fs.writeFileSync(fileName, json.response.body.choices[0].message.content);
    console.log(`Archivo guardado como ${fileName}`);
    break;
  } catch (error) {
    console.error("Error al parsear línea:", line);
  }
}
