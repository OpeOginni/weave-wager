"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const z = require("zod");
import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Minus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
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

export default function CreateWagerForm() {
  const router = useRouter();
  const matchId = router.query.match_id;
  const { address } = useAccount();
  const weaveDB = useWeaveDBContext();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stake: 0,
      maxParticipants: 0,
      home: 0,
      away: 0,
    },
  });

  async function onSubmit(values) {
    const createWagerDTO = {
      wager_id: "1",
      match_id: matchId,
      stake_amount: values.stake,
      max_participants: values.maxParticipants,
      created_at: Date.now(),
      creator_address: address,
    };

    const createPredictionDTO = {
      wager_id: "1",
      user_address: address,
      predicted_score: `${values.home}-${values.away}`,
    };

    try {
      console.log(createWagerDTO);
      // TODO: Sign Create Wager Transaction

      const wagerResult = await weaveDB.add(createWagerDTO, "wagers");

      if (!wagerResult.success) throw new Error("Failed to create wager");
      console.log(result);
      console.log("Wager Created");

      console.log(createPredictionDTO);

      const predictionResult = await weaveDB.add(
        createPredictionDTO,
        "predictions"
      );

      if (!predictionResult.success) throw new Error("Failed to create wager");

      console.log("Prediction Created");
    } catch (e) {
      console.log("ERROR");
      return console.log(e);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="stake"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stake</FormLabel>
              <FormControl>
                <Input type="number" placeholder={150} {...field} />
              </FormControl>
              <FormDescription>How much you want to wager</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Participants</FormLabel>
              <FormControl>
                <Input type="number" placeholder={2} {...field} />
              </FormControl>
              <FormDescription>Maximum Number of Participants</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row justify-between gap-2 items-center text-center mx-40">
          <FormField
            control={form.control}
            name="home"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HOME</FormLabel>
                <FormControl>
                  <Input
                    className="border rounded-xl text-center h-[60px] w-[60px] px-5 py-3"
                    type="number"
                    placeholder={0}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Minus className="w-10 h-10  font-extrabold text-purple-800" />
          </div>

          <FormField
            control={form.control}
            name="away"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AWAY</FormLabel>
                <FormControl>
                  <Input
                    className="border rounded-xl text-center h-[60px] w-[60px] px-5 py-3"
                    type="number"
                    placeholder={0}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="border" type="submit">
          Create Wager
        </Button>
      </form>
    </Form>
  );
}
