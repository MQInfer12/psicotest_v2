# AGENTS.md

## Reglas generales del repo
- Leer este archivo antes de iniciar cualquier tarea y mantenerlo actualizado con aprendizajes generales.
- Al tocar datos de backend (migrations, seeders, archivos JSON de `database/seeders/Data`), revisar también el flujo de CI/CD en `.github/workflows`.
- Verificar si los seeders son idempotentes (`updateOrCreate`, `firstOrCreate`) o no (`create`) antes de ejecutar/pushear cambios.
- Si se implementan reglas de acceso/permisos, validar la restricción en frontend y también en backend (no depender solo de ocultar UI), salvo que se acuerde explícitamente una etapa solo frontend.
- Para restricciones de acceso condicionales (por ejemplo dominio de email), centralizar la condición en hooks/utilidades reutilizables y reutilizarla en menú, rutas protegidas y vistas principales.
- Para búsquedas en código, preferir `rg`/`rg --files` por velocidad.
- No asumir éxito del deploy solo por el resultado del pipeline: validar logs y/o salida real de migraciones y seeds.
