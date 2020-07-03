const calcCharges = (received, charges) => {
  return received - received / (charges / 100 + 1);
};

const calcDeposit = (received = 0, allocated = 0, charges = 0) => {
  // received - (received - received / (charges / 100 + 1)) - allocated
  return received - calcCharges(received, charges) - allocated;
};

const calcDepositStatic = (received = 0, allocated = 0, charges = 0) => {
  return received - charges - allocated;
};

const roundUpUnallocated = unallocated => {
  const output = (Math.ceil(Number(unallocated)) * 100) / 100;
  // return output.split('.').length > 1 ? output.toFixed(2) : output;
  return output;
};

export { calcDeposit, calcDepositStatic, roundUpUnallocated };
