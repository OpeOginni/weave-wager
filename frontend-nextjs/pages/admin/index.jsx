import CreateMatchForm from "../../components/CreateMatchForm";
import ResolveWagerForm from "../../components/ResolveWagers";
import RunCronJobForm from "../../components/RunCronJobForm";
import UpdateMatchResultForm from "../../components/UpdateMatchResultForm";
import { useAccount } from "wagmi";

export default function AdminPage() {
  const { address, status } = useAccount();

  return (
    <div className="flex flex-col gap-14 items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 text-center border rounded-lg p-7">
        <p>Create New Match</p>
        <CreateMatchForm />
      </div>

      <div className="flex flex-col gap-4 text-center border rounded-lg p-7">
        <p>Update Match Result</p>
        <UpdateMatchResultForm />
      </div>

      <div className="flex flex-col gap-4 text-center border rounded-lg p-7">
        <p>Run Weave Cron JOB</p>
        <RunCronJobForm />
      </div>

      <div className="flex flex-col gap-4 text-center border rounded-lg p-7">
        <p>Resolve Wagers</p>
        <ResolveWagerForm />
      </div>
    </div>
  );
}
