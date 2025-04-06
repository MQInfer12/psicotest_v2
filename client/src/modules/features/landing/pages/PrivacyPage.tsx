import Canvas from "@/modules/core/components/ui/canvas/Canvas";
import { PUBLIC_NAVBAR_HEIGHT } from "../../_layout/constants/LAYOUT_SIZES";
import { MeasureContextProvider } from "../../_layout/context/MeasureContext";
import Footer from "../components/Footer";

const PrivacyPage = () => {
  return (
    <>
      <section className="min-h-[100svh] relative isolate">
        <div
          className="w-full relative flex flex-col justify-center isolate"
          style={{
            paddingTop: PUBLIC_NAVBAR_HEIGHT + 40,
          }}
        >
          <MeasureContextProvider>
            <Canvas type="privacy">
              <Canvas.Title>Neurall</Canvas.Title>
              <Canvas.Subtitle>Políticas de Privacidad</Canvas.Subtitle>
              <Canvas.Paragraph>
                Neurall se compromete a proteger la privacidad de nuestros
                usuarios y garantizar la seguridad de la información recopilada
                a través de nuestra aplicación web. Esta política describe cómo
                gestionamos, utilizamos y protegemos los datos de los
                estudiantes, psicólogos y otros usuarios de la plataforma,
                asegurando el cumplimiento de principios éticos y normativas
                aplicables.
              </Canvas.Paragraph>
              <Canvas.Subtitle>Información recopilada</Canvas.Subtitle>
              <Canvas.Paragraph>
                Neurall recopila y utiliza información personal y académica
                necesaria para los siguientes propósitos:
              </Canvas.Paragraph>
              <Canvas.Vignette subtitle="Creación de cuentas">
                Nombre, correo electrónico e información básica al iniciar
                sesión mediante Google OAuth.
              </Canvas.Vignette>
              <Canvas.Vignette subtitle="Realización de tests vocacionales">
                Respuestas a preguntas relacionadas con aptitudes e intereses, y
                resultados generados automáticamente por el sistema.
              </Canvas.Vignette>
              <Canvas.Vignette subtitle="Gestión de citas">
                Datos personales como nombre, género, fecha de nacimiento, algún
                contacto y horarios seleccionados para la atención en el
                gabinete psicológico.
              </Canvas.Vignette>
              <Canvas.Vignette subtitle="Datos de consulta psicológica">
                Anotaciones del psicólogo sobre el motivo de la consulta,
                antecedentes familiares, observaciones y reportes generados en
                las citas.
              </Canvas.Vignette>
              <Canvas.Subtitle>Uso de la información</Canvas.Subtitle>
              <Canvas.Paragraph>
                La información recopilada se utiliza exclusivamente para los
                fines siguientes:
              </Canvas.Paragraph>
              <Canvas.Vignette>
                Aplicación, calificación y análisis de tests vocacionales
                mediante la API de OpenAI.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Generación de resultados personalizados y recomendaciones de
                carreras.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Gestión eficiente de citas en el gabinete psicológico, evitando
                intermediarios innecesarios.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Registro y seguimiento de la evolución psicológica de los
                estudiantes.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Generación de reportes y documentos necesarios para procesos
                académicos o legales.
              </Canvas.Vignette>
              <Canvas.Subtitle>Almacenamiento y Seguridad</Canvas.Subtitle>
              <Canvas.Paragraph>
                En Neurall implementamos medidas de seguridad avanzadas para
                proteger la información, incluyendo:
              </Canvas.Paragraph>
              <Canvas.Vignette>
                Encriptación de datos durante la transmisión y almacenamiento.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Uso de autenticación segura a través de Google OAuth para acceso
                de usuarios.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Acceso restringido a datos confidenciales únicamente a usuarios
                autorizados (psicólogos y administradores).
              </Canvas.Vignette>
              <Canvas.Vignette>
                Integración con Google Calendar para gestión de citas,
                garantizando privacidad mediante controles de acceso.
              </Canvas.Vignette>
              <Canvas.Subtitle>Compartición de Datos</Canvas.Subtitle>
              <Canvas.Paragraph>
                Neurall no comparte información personal con terceros, excepto
                en los casos necesarios para el funcionamiento de la aplicación,
                tales como:
              </Canvas.Paragraph>
              <Canvas.Vignette>
                Servicios de Google (OAuth, Calendar y Gmail) para
                autenticación, gestión de citas y envío de respuestas a personas
                evaluadas.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Procesamiento de datos a través de la API de OpenAI para generar
                resultados de tests.
              </Canvas.Vignette>
              <Canvas.Paragraph>
                En ningún caso se venderá o compartirá información personal con
                fines comerciales.
              </Canvas.Paragraph>
              <Canvas.Paragraph>
                Neurall no utiliza los datos de usuario obtenidos a través de la
                API de Google Workspace para desarrollar, mejorar o entrenar
                modelos de inteligencia artificial o aprendizaje automático
                generalizados. Esta restricción aplica específicamente a los
                datos accedidos mediante servicios como Google OAuth, Google
                Calendar, Gmail y refleja nuestro compromiso con la privacidad y
                la transparencia.
              </Canvas.Paragraph>
              <Canvas.Subtitle>Derechos de los Usuarios</Canvas.Subtitle>
              <Canvas.Paragraph>
                Los usuarios de Neurall tienen los siguientes derechos:
              </Canvas.Paragraph>
              <Canvas.Vignette>
                Acceder, rectificar o eliminar su información personal
                almacenada en la plataforma.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Revocar su consentimiento para el uso de datos personales.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Solicitar la exportación de sus datos en formatos estándar como
                PDF.
              </Canvas.Vignette>
              <Canvas.Subtitle>
                Responsabilidades de los Psicólogos y Administradores
              </Canvas.Subtitle>
              <Canvas.Paragraph>
                El uso de Neurall por parte de psicólogos y administradores está
                regulado para garantizar la confidencialidad y privacidad de los
                datos. Esto incluye la obligación de:
              </Canvas.Paragraph>
              <Canvas.Vignette>
                Tratar los datos sensibles con el más alto grado de
                confidencialidad.
              </Canvas.Vignette>
              <Canvas.Vignette>
                No divulgar información personal sin el consentimiento explícito
                del estudiante.
              </Canvas.Vignette>
              <Canvas.Vignette>
                Utilizar la información únicamente para los fines establecidos
                en esta política.
              </Canvas.Vignette>
              <Canvas.Subtitle>
                Terceros y Herramientas de Terceros
              </Canvas.Subtitle>
              <Canvas.Paragraph>
                Neurall integra herramientas externas, como la API de OpenAI y
                Google Calendar. Nos aseguramos de que estos servicios cumplan
                con altos estándares de privacidad y seguridad, pero no somos
                responsables de sus políticas externas.
              </Canvas.Paragraph>
              <Canvas.Subtitle>
                Cambios en la Política de Privacidad
              </Canvas.Subtitle>
              <Canvas.Paragraph>
                Esta política de privacidad puede actualizarse periódicamente
                para reflejar mejoras en la seguridad o cambios en la
                legislación. Notificaremos a los usuarios sobre cambios
                significativos mediante los canales de contacto registrados.
              </Canvas.Paragraph>
              <Canvas.Subtitle>Contacto</Canvas.Subtitle>
              <Canvas.Paragraph>
                Si tienes preguntas o inquietudes sobre nuestra política de
                privacidad, puedes contactarnos en:
              </Canvas.Paragraph>
              <Canvas.Vignette subtitle="Correo Electrónico">
                psicologiaunifranz@gmail.com
              </Canvas.Vignette>
              <Canvas.Vignette subtitle="Dirección">
                Cochabamba, Bolivia - Av. Gualberto Villarroel y Portales.
              </Canvas.Vignette>
            </Canvas>
          </MeasureContextProvider>
        </div>
      </section>
      <Footer secondary />
    </>
  );
};

export default PrivacyPage;
