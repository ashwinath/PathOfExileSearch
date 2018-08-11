import * as Bunyan from "bunyan";

const env = process.env.ENV || "DEV";

const prodStreams: Bunyan.Stream[] = [
  {
    level: "info",
    path: "/var/log/website/log.txt",
  }
];

const devStreams: Bunyan.Stream[] = [
  {
    level: "debug",
    stream: process.stdout,
  }
];

const logger = Bunyan.createLogger({
  name: "website",
  streams: env === "PROD" ? prodStreams : devStreams,
});

export default logger;
