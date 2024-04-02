"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const z = require("zod");
const dotenv = require("dotenv");
import { useWeaveDBContext } from "../providers/WeaveDBContext";
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
import { weaveDBCron } from "../lib/crons";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

dotenv.config();

export default function RunCronJobForm() {
  const [isPending, setIsPending] = useState(false);
  const db = useWeaveDBContext();
  const { toast } = useToast();

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
      setIsPending(true);
      const cronJob = weaveDBCron(
        runCronJobDTO.matchweek_start,
        runCronJobDTO.matchweek_end,
        runCronJobDTO.interval
      );

      await db.weaveDB.addCron(cronJob, "get-winners-cron");

      setIsPending(false);

      toast({
        title: "Cron Added",
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

        <Button disabled={isPending} className="border" type="submit">
          {isPending ? "Creating Cron..." : "Run Winner Cron"}
        </Button>
      </form>
    </Form>
  );
}
