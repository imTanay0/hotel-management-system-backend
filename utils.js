export const calcNoOfDays = (date1, date2) => {
  const newDate1 = new Date(date1);
  const newDate2 = new Date(date2);

  const diffInMilliseconds = newDate2 - newDate1;
  const diffInSeconds = diffInMilliseconds / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  return Math.floor(diffInDays);
};

export const calcRoomBill = (noOfDays, rent) => {
  const total = noOfDays * rent;
  const GST = total * 0.12;
  return total + GST;
};

export const calcFoodBill = (userFoods, foodPrices) => {
  let sum = 0;

  for (var i = 0; i < userFoods.length; i++) {
    const amount = userFoods[i].amount;
    const price = foodPrices[i].foodPrice;

    sum += amount * price;
  }

  const GST = sum * 0.05;
  return sum + GST;
};
