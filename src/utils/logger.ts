import { Logger, type ILogObjMeta } from 'tslog';
import * as Sentry from '@sentry/capacitor';

export const LogLevel = {
  SILLY: 0,
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  FATAL: 6,
};

interface ILoggerParam {
  [key: string]: unknown;
}

interface LogFormatParams {
  message: string | Record<string, unknown>;
  params: unknown[];
}

export class CustomLogger<LogObj extends Record<string, unknown>> extends Logger<LogObj> {
  private formatMessage(message: string | Record<string, unknown>): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }

    return String(message);
  }

  private formatParams(params: unknown[]): string {
    if (!params?.length) {
      return '';
    }

    const loggerParam = params[0] as ILoggerParam;

    const formattedParams = Object.entries(loggerParam)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');

    return formattedParams ? ` (${formattedParams})` : '';
  }

  private format({ message, params }: LogFormatParams): string {
    return `${this.formatMessage(message)}${this.formatParams(params)}`;
  }

  public override debug(...args: unknown[]): LogObj & ILogObjMeta | undefined {
    const [message, ...params] = args;

    return super.debug(this.format({ message: message as string | Record<string, unknown>, params }));
  }

  public override info(...args: unknown[]): LogObj & ILogObjMeta | undefined {
    const [message, ...params] = args;

    return super.info(this.format({ message: message as string | Record<string, unknown>, params }));
  }

  public override error(...args: unknown[]): LogObj & ILogObjMeta | undefined {
    const [firstArg, secondArg, ...params] = args;

    if (secondArg) {
      // If both title and error are provided
      const formattedError = this.format({
        message: firstArg as string | Record<string, unknown>,
        params: [secondArg, ...params]
      });

      const result = super.error(formattedError);

      // Log the raw error separately
      console.error(secondArg);

      // Send error to Sentry if it's an Error object
      if (secondArg instanceof Error) {
        if (Sentry && typeof Sentry.captureException === 'function') {
          Sentry.captureException(secondArg);
        }
      }

      return result;
    } else {
      // If only the error is provided
      const error = firstArg;
      console.error(error);

      // Send error to Sentry if it's an Error object
      if (error instanceof Error) {
        if (Sentry && typeof Sentry.captureException === 'function') {
          Sentry.captureException(error);
        }
      }

      return undefined;
    }
  }

  public override warn(...args: unknown[]): LogObj & ILogObjMeta | undefined {
    const [message, ...params] = args;

    return super.warn(this.format({ message: message as string | Record<string, unknown>, params }));
  }
}

export const createLogger = ({
  name,
  debugEnabled = false,
}: {
  name?: string;
  debugEnabled?: boolean;
} = {}) => {
  const spacingStr = '  ';
  const prettyLogTemplate = `[{{hh}}:{{MM}}:{{ss}}]${
    name ? `${spacingStr}{{name}}` : ''
  }${spacingStr}{{logLevelName}}${spacingStr}`;

  return new CustomLogger<Record<string, unknown>>({
    name,
    prettyLogTemplate,
    prettyLogTimeZone: 'local',
    prettyLogStyles: {
      name: ['bold', 'green'],
      logLevelName: {
        '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
        SILLY: ['bold', 'white'],
        TRACE: ['bold', 'whiteBright'],
        DEBUG: ['bold', 'blackBright'],
        INFO: ['bold', 'blue'],
        WARN: ['bold', 'yellow'],
        ERROR: ['bold', 'red'],
        FATAL: ['bold', 'redBright'],
      },
    },
    minLevel: debugEnabled ? LogLevel.SILLY : LogLevel.INFO,
  });
};
