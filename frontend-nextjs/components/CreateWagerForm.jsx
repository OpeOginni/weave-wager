"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const z = require("zod");
const dotenv = require("dotenv");
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { parseEther, decodeEventLog } from "viem";
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
import { createWagerFormSchema } from "../types";
import { abi, createWagerAbi, createdWagerEventAbi } from "../abi/weaveWager";
import { config } from "../config/config";

dotenv.config();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function CreateWagerForm({ match_timestamp }) {
  const { isPending, writeContractAsync } = useWriteContract();

  const router = useRouter();
  const matchId = router.query.match_id;
  const { address } = useAccount();
  const db = useWeaveDBContext();

  const form = useForm({
    resolver: zodResolver(createWagerFormSchema),
    defaultValues: {
      stake: 0,
      maxParticipants: 0,
      home: 0,
      away: 0,
    },
  });

  async function onSubmit(values) {
    const createWagerDTO = {
      wager_id: undefined,
      match_id: matchId,
      stake_amount: values.stake,
      max_participants: values.maxParticipants,
      created_at: Date.now(),
      creator_address: address,
      match_timestamp: match_timestamp,
    };

    const createPredictionDTO = {
      wager_id: undefined,
      user_address: address,
      predicted_score: `${values.home}-${values.away}`,
    };

    try {
      console.log(createWagerDTO);
      // TODO: Sign Create Wager Transaction

      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: createWagerAbi,
        functionName: "createWager",
        args: [
          BigInt(createWagerDTO.match_id),
          parseEther(createWagerDTO.stake_amount.toString()),
          BigInt(createWagerDTO.max_participants),
          BigInt(createWagerDTO.match_timestamp),
        ],
        value: parseEther(createWagerDTO.stake_amount.toString()),
      });

      console.log("Result");
      console.log(result);

      const reciept = await waitForTransactionReceipt(config, { hash: result });

      // Help me to loop through the logs object in reciept

      console.log("reciept");
      console.log(reciept);

      const createdWagerEvent = decodeEventLog({
        abi: createdWagerEventAbi,
        data: reciept.logs[0].data,
        topics: reciept.logs[0].topics,
      });

      console.log("createdWagerEvent");
      console.log(createdWagerEvent);

      createWagerDTO.wager_id = Number(
        createdWagerEvent.args.wagerId
      ).toString();
      createPredictionDTO.wager_id = Number(
        createdWagerEvent.args.wagerId
      ).toString();

      console.log(createWagerDTO);
      console.log(createPredictionDTO);

      const wagerResult = await db.weaveDB.set(
        createWagerDTO,
        "wagers",
        `${createWagerDTO.match_id}-${createWagerDTO.creator_address}`,
        db.identity
      );

      if (!wagerResult.success) throw new Error("Failed to create wager");

      console.log(createPredictionDTO);

      const predictionResult = await db.weaveDB.set(
        createPredictionDTO,
        "predictions",
        `${createPredictionDTO.wager_id}-${createPredictionDTO.user_address}`,
        db.identity
      );

      if (!predictionResult.success) throw new Error("Failed to create wager");

      console.log("Prediction Created");

      router.push(`/wager/${createWagerDTO.wager_id}`);
    } catch (e) {
      console.log("ERROR 2");
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
