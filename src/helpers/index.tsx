export const getHorizontalNumberArray = (data) => {
  return data.map((row) => row.join(","));
};

export const getVerticalNumberArray = (data) => {
  return data.reduce((acc, row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      acc[columnIndex] = acc[columnIndex] || [];
      acc[columnIndex][rowIndex] = cell;
    });
    return acc;
  }, []);
};

export const getDiagonalNumberArray = (data) => {
  return [
    data.map((row, index) => row[index]),
    data.map((row, index) => row[4 - index]),
  ];
};
