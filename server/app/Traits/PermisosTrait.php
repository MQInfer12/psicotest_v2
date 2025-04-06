<?php

namespace App\Traits;

trait PermisosTrait
{
  protected function tienePermiso($user, $permiso)
  {
    return in_array($permiso, $user->rol->permisos);
  }
}
