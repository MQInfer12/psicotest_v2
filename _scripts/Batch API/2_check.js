import { openai } from "./openai.js";

const batch = await openai.batches.retrieve(
  "batch_67eb32cddba48190bdaafc572e328bdd"
);

console.log(batch);
