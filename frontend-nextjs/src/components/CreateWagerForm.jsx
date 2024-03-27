'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
const z = require('zod');
// import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  stake: z.number({ coerce: true }).gte(0.0, {
    message: 'Stake must be greater than 0.',
  }),
  maxParticipants: z.number({ coerce: true }).gte(2, {
    message: 'Max participants must be greater than 1.',
  }),
});

export default function CreateWagerForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stake: 0,
      maxParticipants: 0,
    },
  });

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
        <Button className="border" type="submit">
          Create Wager
        </Button>
      </form>
    </Form>
  );
}
