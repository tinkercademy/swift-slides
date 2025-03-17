import { Editor } from '@/components/playground';
import { SplitView } from '@/components/splitView';

export default function PlaygroundPage() {
  return (
    <SplitView left={<Editor />} right={<div/>} />
  )
}