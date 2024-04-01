const z = require("zod");

export const createWagerFormSchema = z.object({
  stake: z.number({ coerce: true }).gt(0, {
    message: "Stake must be greater than 0.",
  }),
  maxParticipants: z.number({ coerce: true }).gt(1, {
    message: "Max participants must be greater than 1.",
  }),
  home: z
    .number({ coerce: true })
    .nonnegative({
      message: "Prediction must be Positive.",
    })
    .safe({
      message: "Prediction must be a number.",
    }),
  away: z
    .number({ coerce: true })
    .nonnegative({
      message: "Prediction must be Positive.",
    })
    .safe({
      message: "Prediction must be a number.",
    }),
});

export const createMatchFormSchema = z.object({
  match_id: z.number({ coerce: true }).gt(0, {
    message: "Match ID must be greater than 0.",
  }),
  home_team: z.string(),
  away_team: z.string(),
  match_timestamp: z.number({ coerce: true }).gt(0, {
    message: "Match_timestamp must be greater than 0.",
  }),
});

export const updateMatchResultFormSchema = z.object({
  match_id: z.number({ coerce: true }).gt(0, {
    message: "Match ID must be greater than 0.",
  }),
  result: z.string(),
});

export const runCronJobFormSchema = z.object({
  matchweek_start: z.number({ coerce: true }).gt(0, {
    message: "Matchweek Start Timestamp must be greater than 0.",
  }),
  matchweek_end: z.number({ coerce: true }).gt(0, {
    message: "Matchweek End Timestamp must be greater than 0.",
  }),
  interval: z.number({ coerce: true }).gt(0, {
    message: "Interval must be greater than 0.",
  }),
});

export const resolveWagerFormSchema = z.object({
  match_id: z.number({ coerce: true }).gt(0, {
    message: "Match ID must be greater than 0.",
  }),
});
