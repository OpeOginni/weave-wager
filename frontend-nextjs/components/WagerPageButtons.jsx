"use client";
const z = require("zod");
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Copy, Minus } from "lucide-react";
import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

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

export function WagerButton() {
  const router = useRouter();
  const wagerId = router.query.id;
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
      console.log(dto);
      // TODO: Sign Prediction Transaction

      await db.weaveDB.set(
        dto,
        "predictions",
        `${dto.wager_id}-${dto.user_address}`,
        db.identity
      );

      console.log("Prediction Created");
    } catch (e) {
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

        <Button className="border">WAGER</Button>
      </form>
    </Form>
  );
}

export function ShareWagerButton({ wager_id }) {
  return (
    <Button
      className="flex flex-row gap-2 border"
      onClick={() => {
        navigator.clipboard.writeText(
          `http://localhost:3000/wager/${wager_id}`
        );
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
