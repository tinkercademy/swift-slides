import { notFound } from "next/navigation";
import { ParityReportClient } from "./ParityReportClient";

export default async function ParityReportPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  if (!runId) notFound();
  return <ParityReportClient runId={runId} />;
}
