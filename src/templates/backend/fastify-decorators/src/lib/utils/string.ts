/* eslint-disable no-console */
export function tap<T>(data: T, stringify = false): T {
  if (stringify) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }

  return data;
}

export const generateRandomSecret = () => {
  // Create an array of all the characters that can be used in the password.
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_+-={}|[]\\:\";'<>?,./";

  // Generate a random password of 48 characters.
  let password = "";
  for (let i = 0; i < 48; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  // Return the password.
  return password;
};
