const findXYZ = (items) => {

  //Find location of X, Y and Z as well as add index
  const newItems = items
    .map((item, i) => {
      return { name: item, id: i };
    })
    .filter(item => {
      return isNaN(item.name);
    });

  //Use math formula to find the answer
  const answers = newItems.map(item => {
    const { id } = item;
    let answer = Math.pow(id, 2) + 3 + id;
    return { name: item.name, answer: answer };
  });

  return answers;
};

module.exports = {
  findXYZ: findXYZ
};
