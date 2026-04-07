import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "process followup emails",
  { minutes: 15 },
  internal.followupsActions.processQueue,
  { limit: 20 }
);

export default crons;
