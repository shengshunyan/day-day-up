export const sleep = async (time = 100) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
