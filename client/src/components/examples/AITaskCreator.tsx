import { AITaskCreator } from '../AITaskCreator'

export default function AITaskCreatorExample() {
  const handleTaskCreate = (task: {
    title: string
    description: string
    category: string
    type: string
    reward: number
  }) => {
    console.log('Task creation completed:', task)
  }

  return (
    <div className="max-w-2xl">
      <AITaskCreator onTaskCreate={handleTaskCreate} />
    </div>
  )
}