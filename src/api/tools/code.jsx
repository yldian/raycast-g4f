import { exec } from "child_process";
import fs from "fs";
import { environment } from "@raycast/api";

export const codeInterpreterPrompt = `
# Function calling: run_code
You have the tool \`run_code\`. It accepts only Python code as input, and returns the output of the code (i.e. the text printed to stdout). 
Note that the code must be real Python code that will be saved to a temporary file and executed. Separate newlines with '\\n' characters.
Use the \`run_code\` function ONLY in the following circumstances: 
    - User asks you to run a code snippet in Python
    - You need to access accurate information that can be done using Python code (e.g. mathematical calculations, data processing, etc.)
Use the tool only when necessary. Understand that it may not be required in 99% of conversations. If it's not needed, respond complete as per normal. Do NOT mention that you have this tool unless you are using it.
Use the tool safely and responsibly. Never make external web requests or API calls. Always ensure that the code is completely safe to run and does NOT modify any local data or interact with the system directly.
`;

// a tool to be passed into OpenAI-compatible APIs
export const codeInterpreterTool = {
  type: "function",
  function: {
    name: "run_code",
    description: codeInterpreterPrompt,
    parameters: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "The Python code to run",
        },
      },
      required: ["code"],
    },
  },
};

// runs the given Python code and returns the output
export const runCode = async (code) => {
  console.log("Running code:", code);
  // put code in temp file in assets folder
  const path = environment.assetsPath + "/temp_run_code.py";
  fs.writeFileSync(path, code);

  return new Promise((resolve, reject) => {
    exec(`python3 ${path}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`exec error: ${error}`);
        resolve(`ERROR: ${error.name} - ${error.message}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};
