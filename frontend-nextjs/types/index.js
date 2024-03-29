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
