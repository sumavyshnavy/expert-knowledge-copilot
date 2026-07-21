import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "text-blue-400",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {value}
          </h2>

          <p className="mt-2 text-sm text-green-400">
            {subtitle}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <Icon className={`h-7 w-7 ${color}`} />
        </div>
      </div>
    </div>
  );
}