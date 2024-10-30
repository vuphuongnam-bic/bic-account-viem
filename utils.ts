import fs from "fs";

/**
 * Function to append a new environment variable to .env file if it doesn't already exist.
 * @param filePath - Path to the .env file.
 * @param newEnvVar - A string representing the new environment variable in the format "KEY=VALUE".
 */
export const updateEnvFile = (filePath: string, newEnvVar: string): void => {
  // Split the new environment variable into key and value
  const [newKey, newValue] = newEnvVar.split("=");

  // Read the contents of the .env file
  const envConfig = fs.readFileSync(filePath, "utf-8");

  // Split the file contents into lines, removing empty lines and comments
  const envLines = envConfig
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));

  // Check if the new key already exists in the file
  if (!envLines.some((line) => line.startsWith(`${newKey}=`))) {
    // If the key doesn't exist, append the new variable to the file
    fs.appendFileSync(filePath, `\n${newEnvVar}`);
  } else {
    console.log(`The var ${newKey} already exists, not adding new.`);
  }
};
