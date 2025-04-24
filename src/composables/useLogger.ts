import { createLogger } from '../utils/logger';

export const useLogger = ({
  name,
  debugEnabled,
}: { name?: string; debugEnabled?: boolean } = {}) => {
  const logger = ref(createLogger({ name, debugEnabled: debugEnabled ?? true }));

  return logger.value;
};
