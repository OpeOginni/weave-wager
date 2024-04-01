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
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { runCronJobFormSchema } from "../types";
import { abi, createWagerAbi, createdWagerEventAbi } from "../abi/weaveWager";
import { config } from "../config/config";
import { weaveDBCron } from "../lib/crons";

dotenv.config();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function RunCronJobForm() {
  const { isPending, writeContractAsync } = useWriteContract();

  const router = useRouter();
  const matchId = router.query.match_id;
  const { address } = useAccount();
  const db = useWeaveDBContext();

  const form = useForm({
    resolver: zodResolver(runCronJobFormSchema),
    defaultValues: {
      matchweek_start: 0,
      matchweek_end: 0,
      interval: 0,
    },
  });

  async function onSubmit(values) {
    const runCronJobDTO = {
      matchweek_start: values.matchweek_start,
      matchweek_end: values.matchweek_end,
      interval: values.interval,
    };

    try {
      const cronJob = weaveDBCron(
        runCronJobDTO.matchweek_start,
        runCronJobDTO.matchweek_end,
        runCronJobDTO.interval
      );

      await db.weaveDB.addCron(cronJob, "get-winners-cron");

      alert("Cron Added");
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
          name="matchweek_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MatchWeek Start Timestamp</FormLabel>
              <FormControl>
                <Input type="number" placeholder={150} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="matchweek_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MatchWeek End Timestamp</FormLabel>
              <FormControl>
                <Input type="number" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interval</FormLabel>
              <FormControl>
                <Input type="number" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="border" type="submit">
          Run Winner Cron
        </Button>
      </form>
    </Form>
  );
}
