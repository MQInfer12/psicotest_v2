import { openai } from "./openai.js";

const batch = await openai.batches.create({
  input_file_id: "file-GT9KpdHAaB6RtXXKjiNsNw",
  endpoint: "/v1/chat/completions",
  completion_window: "24h",
});

console.log(batch);
