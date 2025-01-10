export const convertToEasternTime = (unixTimestamp: number): Date => {
  const date = new Date(unixTimestamp * 1000);

  return new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
};
