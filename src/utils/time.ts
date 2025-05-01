import appConfig from '@/config/app';

export const convertToEasternTime = (unixTimestamp: number): Date => {
  const date = new Date(unixTimestamp * 1000);

  return new Date(date.toLocaleString('en-US', { timeZone: appConfig.timezone }));
};

export const debounce = (fn: () => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
};
