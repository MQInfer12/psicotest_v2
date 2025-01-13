import ProtectedRoute from '@/modules/features/auth/components/wrapper/ProtectedRoute'
import { Permisos } from '@/modules/features/auth/types/Permisos'
import PatientPage from '@/modules/features/users/pages/PatientPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/patients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProtectedRoute permisos={[Permisos.VER_CALENDARIO, Permisos.VER_CITAS]}>
      <PatientPage />
    </ProtectedRoute>
  )
}
