export const validateTitle = (title: string) => {
  if (!title) return false;
  if (title.length < 3 || title.length > 64) return false;
  return true;
};

export const validateShortDescription = (description: string) => {
  if (!description) return false;
  if (description.length > 224) return false;
  return true;
};

export const validateDescription = (description: string) => {
  if (!description) return false;
  return true;
};

export const validateToken = (token: string) => {
  if (!token) return false;
  // TODO: Valid address check
  return true;
};

export const validateBeneficiary = (beneficiary: string) => {
  if (!beneficiary) return false;
  // TODO: Valid address check
  return true;
};

export const validateCreator = (creator: string) => {
  if (!creator) return false;
  // TODO: Valid address check
  return true;
};

export const validateFundraiseLength = (length: number) => {
  if (!length) return false;
  if (Number.isNaN(+length)) return false;
  // TODO: Min fundraiseLength check
  return true;
};

export const validateCuratorFee = (fee: number) => {
  if (!fee) return false;
  if (Number.isNaN(+fee)) return false;
  return true;
};

export const validateThreshold = (threshold: number) => {
  if (!threshold) return false;
  if (Number.isNaN(+threshold)) return false;
  // TODO: Min threshold check
  return true;
};
