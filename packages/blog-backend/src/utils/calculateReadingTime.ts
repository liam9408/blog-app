const averageWPM: number = 200; // Replace with the average WPM of a person

export const countWords = (article: string) => {
  const words = article.trim().split(/\s+/);
  return words.length;
};

// Calculate the reading time in minutes
export const calculateReadingTime = (article: string) => {
  const wordCount = countWords(article);
  const minutes = Math.ceil(wordCount / averageWPM);

  return minutes;
};
