import TestSimulatorClient from './TestSimulatorClient';
import { DEFAULT_PASSAGES } from '@/lib/passages';

export function generateStaticParams() {
  return DEFAULT_PASSAGES.map((p) => ({ id: p.id }));
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TestSimulatorClient passageId={id} />;
}
