const idArr: Array<number> = [];
export const createId = () => {
  let newId: number = Math.round(Math.random() * 1000000);

  if (idArr.indexOf(newId) >= 0) {
    newId = createId();
  }
  idArr.push(newId);

  return newId;
};
