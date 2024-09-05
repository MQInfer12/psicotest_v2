import UserPage from '@/modules/features/users/pages/UserPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/users')({
  component: UserPage
})