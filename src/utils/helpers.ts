// Function to generate a random hex color, excluding white and black
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color;
  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === '#FFFFFF' || color === '#000000'); // Exclude white and black
  return color;
};

// Function to generate an array of random colors based on the number of labels
export const generateColors = (count: number) => {
  return Array.from({ length: count }, () => getRandomColor());
};
