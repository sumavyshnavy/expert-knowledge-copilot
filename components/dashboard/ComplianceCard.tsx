interface Props {
  score: number;
}

export default function ComplianceCard({ score }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold text-white">
        Knowledge Base Status
      </h2>

      <div className="mt-8">

        <p className="text-slate-400">
          Upload Completion
        </p>

        <h1 className="mt-3 text-5xl font-bold text-green-400">
          {score}%
        </h1>

        <div className="mt-6 h-3 w-full rounded-full bg-slate-800">

          <div
            className="h-3 rounded-full bg-green-500"
            style={{ width: `${score}%` }}
          />

        </div>

      </div>

    </div>
  );
}