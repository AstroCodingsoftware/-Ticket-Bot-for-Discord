import consoleLogLevel from 'console-log-level';
import chalk from 'chalk';

const logger = consoleLogLevel({
  level: 'info', 
  stderr: true, 
});

export const log = {
  info: (msg) => logger.info(chalk.blue(msg)),
  warn: (msg) => logger.warn(chalk.yellow(msg)),
  error: (msg) => logger.error(chalk.red(msg)),
  debug: (msg) => logger.debug(chalk.gray(msg)),
  success: (msg) => logger.info(chalk.green(msg)),
};
