"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const z = require("zod");
const dotenv = require("dotenv");

import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { useToast } from "./ui/use-toast";
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
import { createMatchFormSchema } from "../types";
import { useState } from "react";

dotenv.config();

export default function CreateMatchForm() {
  const db = useWeaveDBContext();
  const [isPending, setIsPending] = useState();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(createMatchFormSchema),
    defaultValues: {
      match_id: 0,
      home_team: "",
      away_team: "",
      match_timestamp: 0,
    },
  });

  async function onSubmit(values) {
    const createMatchDTO = {
      match_id: String(values.match_id),
      home_team: values.home_team,
      away_team: values.away_team,
      match_timestamp: values.match_timestamp,
      status: "ONGOING",
    };

    try {
      setIsPending(true);
      const match = await db.weaveDB.get("matches", createMatchDTO.match_id);

      if (match) throw new Error("Match ID Exist");

      const matchResult = await db.weaveDB.set(
        createMatchDTO,
        "matches",
        createMatchDTO.match_id
      );

      if (!matchResult.success) throw new Error("Failed to create wager");

      setIsPending(false);
      toast({
        title: "Match Created",
      });
    } catch (e) {
      setIsPending(false);
      toast({
        title: "Error",
        variant: "destructive",
        description: e.message,
      });
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

        <FormField
          control={form.control}
          name="home_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Team</FormLabel>
              <FormControl>
                <Input type="text" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="away_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away Team</FormLabel>
              <FormControl>
                <Input type="text" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="match_timestamp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Start Timestamp</FormLabel>
              <FormControl>
                <Input type="number" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} className="border" type="submit">
          {isPending ? "Creating Match..." : "Create Match"}
        </Button>
      </form>
    </Form>
  );
}
