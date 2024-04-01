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
import { resolveWagerFormSchema } from "../types";
import { resolveWagerAbi } from "../abi/weaveWager";

dotenv.config();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function ResolveWagerForm() {
  const { writeContractAsync } = useWriteContract();

  const db = useWeaveDBContext();

  const form = useForm({
    resolver: zodResolver(resolveWagerFormSchema),
    defaultValues: {
      wager_id: 0,
    },
  });

  async function onSubmit(values) {
    try {
      const prediction = await db.weaveDB.get(
        "predictions",
        `${values.wager_id}`
      );

      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: resolveWagerAbi,
        functionName: "resolveWager",
        args: [BigInt(values.wager_id), prediction.winners],
      });

      if (!result) throw new Error("Failed to Resolve Wager");

      alert("Wager Resolved");
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
          name="match_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Id</FormLabel>
              <FormControl>
                <Input type="number" placeholder={150} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="border" type="submit">
          Resolve Completed Wagers
        </Button>
      </form>
    </Form>
  );
}
