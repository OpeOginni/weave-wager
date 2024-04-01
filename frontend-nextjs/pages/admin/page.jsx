import CreateMatchForm from "../../components/CreateMatchForm";
import ResolveWagerForm from "../../components/ResolveWagers";
import RunCronJobForm from "../../components/RunCronJobForm";
import UpdateMatchResultForm from "../../components/UpdateMatchResultForm";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-14 items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 text-center">
        <p>Create New Match</p>
        <CreateMatchForm />
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p>Update Match Result</p>
        <UpdateMatchResultForm />
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p>Run Weave Cron JOB</p>
        <RunCronJobForm />
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p>Resolve Wagers</p>
        <ResolveWagerForm />
      </div>
    </div>
  );
}
