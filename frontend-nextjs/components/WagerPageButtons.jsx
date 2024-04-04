"use client";
const z = require("zod");
const dotenv = require("dotenv");

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Copy, Minus } from "lucide-react";
import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { parseEther, decodeEventLog } from "viem";

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
import { config } from "../config/config";
import {
  joinWagerAbi,
  resolveWagerAbi,
  cancleWagerAbi,
} from "../abi/weaveWager";
import { useWriteContract } from "wagmi";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

const wagerFormSchema = z.object({
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

dotenv.config();

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export function WagerButton({ wager_stake }) {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const { writeContractAsync } = useWriteContract();

  const wagerId = router.query.wager_id;
  const { address } = useAccount();
  const db = useWeaveDBContext();

  const form = useForm({
    resolver: zodResolver(wagerFormSchema),
    defaultValues: {
      home: null,
      away: null,
    },
  });

  async function onSubmit(values) {
    const dto = {
      wager_id: wagerId,
      user_address: address,
      predicted_score: `${values.home}-${values.away}`,
    };
    try {
      setIsPending(true);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: joinWagerAbi,
        functionName: "joinWager",
        args: [BigInt(dto.wager_id)],
        value: wager_stake,
      });

      await db.weaveDB.set(
        dto,
        "predictions",
        `${dto.wager_id}-${dto.user_address}`
      );
      setIsPending(false);
      toast({
        title: "Prediction Created",
      });
    } catch (e) {
      setIsPending(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: e.message,
      });
      console.log(e);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center space-y-8"
      >
        <div className="flex flex-row justify-between gap-2 items-center text-center">
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
                    placeholder={null}
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
                    placeholder={null}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isPending} className="border">
          {isPending ? "Placing Wager..." : "Wager"}
        </Button>
      </form>
    </Form>
  );
}

export function ResolveWagerButton({ wager_id }) {
  const [isPending, setIsPending] = useState(false);
  const db = useWeaveDBContext();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  async function resolveWager() {
    try {
      setIsPending(true);

      const wagers = await db.weaveDB.get(
        "wagers",
        ["wager_id"],
        ["wager_id", "==", wager_id]
      );

      const wager = wagers[0];

      const match = await db.weaveDB.get("matches", wager.match_id);

      if (match.winners_choosen)
        throw new Error("Winners have been choosen already");

      if (match.status === "ONGOING" || !match.status)
        throw new Error("Match result not available Yet");

      const wagerPredictions = await db.weaveDB.get(
        "predictions",
        ["wager_id"],
        ["wager_id", "==", wager.wager_id]
      );

      const wagerWinners = [];

      for (const prediction of wagerPredictions) {
        if (prediction.predicted_score === match.result) {
          wagerWinners.push(prediction.user_address);
        }
      }

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: resolveWagerAbi,
        functionName: "resolveWager",
        args: [BigInt(wager_id), wagerWinners],
      });

      await db.weaveDB.set(
        { wager_id: wager.wager_id, winners: wagerWinners },
        "winners",
        wager.wager_id
      );

      setIsPending(false);
      toast({
        title: "Wager Resolved",
      });
    } catch (e) {
      setIsPending(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: e.message,
      });
      console.log(e);
    }
  }

  return (
    <Button
      disabled={isPending}
      className="border"
      onClick={() => resolveWager()}
    >
      {isPending ? "Resolving Wager" : "Resolve Wager"}
    </Button>
  );
}

export function CancelWagerButton({ wager_id }) {
  const [isPending, setIsPending] = useState(false);
  const db = useWeaveDBContext();
  const { toast } = useToast();
  const { writeContractAsync } = useWriteContract();

  async function cancleWager() {
    try {
      setIsPending(true);

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: cancleWagerAbi,
        functionName: "cancleWager",
        args: [BigInt(wager_id)],
      });

      setIsPending(false);
      toast({
        title: "Wager Cancled",
      });
    } catch (e) {
      setIsPending(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: e.message,
      });
      console.log(e);
    }
  }

  return (
    <Button
      disabled={isPending}
      className="border"
      onClick={() => cancleWager()}
    >
      {isPending ? "Canceling Wager..." : "Cancle Wager"}
    </Button>
  );
}

export function ShareWagerButton({ wager_id }) {
  const { toast } = useToast();

  return (
    <Button
      className="flex flex-row gap-2 border"
      onClick={() => {
        navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_SITE_URL}/wager/${wager_id}`
        );

        toast({
          title: "Wager Link Copied",
        });
      }}
    >
      SHARE WAGER <Copy />
    </Button>
  );
}

export function JoinedWagerButton() {
  return (
    <Button disabled={true} className="border">
      ALREADY JOINED
    </Button>
  );
}

export function YouWonButton() {
  return (
    <Button disabled={true} className="border">
      YOU WON 🎉
    </Button>
  );
}

export function YouLostButton() {
  return (
    <Button disabled={true} className="border">
      YOU LOST 😢
    </Button>
  );
}

export function DrawButton() {
  return (
    <Button disabled={true} className="border">
      ALL TIED 🤝
    </Button>
  );
}
