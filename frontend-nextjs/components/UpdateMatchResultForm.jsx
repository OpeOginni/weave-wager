"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const dotenv = require("dotenv");

import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { useRouter } from "next/router";
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
import { updateMatchResultFormSchema } from "../types";
import { useState } from "react";

dotenv.config();

export default function UpdateMatchResultForm() {
  const db = useWeaveDBContext();
  const [isPending, setIsPending] = useState();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(updateMatchResultFormSchema),
    defaultValues: {
      match_id: 0,
      result: "",
    },
  });

  async function onSubmit(values) {
    const updateMatchDTO = {
      match_id: String(values.match_id),
      result: values.result,
    };

    try {
      setIsPending(true);

      const wagerResult = await db.weaveDB.update(
        { result: updateMatchDTO.result, status: "COMPLETED" },
        "matches",
        `${updateMatchDTO.match_id}`
      );

      if (!wagerResult.success) throw new Error("Failed to Update Match");

      toast({
        title: "Match Updated",
      });
      setIsPending(false);
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
          name="result"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Result</FormLabel>
              <FormControl>
                <Input type="text" placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} className="border" type="submit">
          {isPending ? "Updating Match..." : "Update Match"}
        </Button>
      </form>
    </Form>
  );
}
