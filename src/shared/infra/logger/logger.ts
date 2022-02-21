import winston from "winston";

// @ts-ignore
export class Logger {
  logger: winston.Logger;

  alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({
      label: "[LOGGER]",
    }),
    winston.format.timestamp({
      format: "YY-MM-DD HH:MM:SS",
    }),
    winston.format.printf(
      (info) =>
        ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
    )
  );

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.label(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            this.alignColorsAndTime
          ),
        }),
      ],
    });

    if (process.env.NODE_ENV === "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }
  log(message: any, o?: any) {
    this.logger.log(message, o);
  }
  error(message: any, o?: any) {
    this.logger.error(message, o);
  }
  info(message: any, o?: any) {
    this.logger.info(message, o);
  }
  debug(message: any, o?: any) {
    this.logger.debug(message, o);
  }
  warn(message: any, o?: any) {
    this.logger.warn(message, o);
  }
}
