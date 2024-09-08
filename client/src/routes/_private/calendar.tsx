import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/calendar')({
  component: () => <div>Hello /_private/calendar!</div>
})