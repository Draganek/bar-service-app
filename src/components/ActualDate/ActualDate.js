function ActualDate(props) {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const formatedDay = day < 10 ? "0" + day : day;
  const formatedMonth = month < 10 ? "0" + month : month;

  const formattedDate = `${formatedDay}-${formatedMonth}-${year}`;
  return formattedDate;
}

export default ActualDate;
