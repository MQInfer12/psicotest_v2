import fs from "fs";
import { openai } from "./openai.js";

const file = await openai.files.create({
  file: fs.createReadStream("batch.jsonl"),
  purpose: "batch",
});

console.log(file);
