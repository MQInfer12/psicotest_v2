import { useEffect, useState } from "react";
import Secret from "@/assets/sounds/secret.mp3";

const konamiCode = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
  "enter",
];

export const useKonamiCode = (active: boolean, fn: () => void, deps: any[]) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);

  useEffect(() => {
    if (active) {
      const handleKeyPress = (e: KeyboardEvent) => {
        const keyPressed = e.key.toLowerCase();
        setKeySequence((prev) => {
          const updatedSequence = [...prev, keyPressed].slice(
            -konamiCode.length
          );
          if (JSON.stringify(updatedSequence) === JSON.stringify(konamiCode)) {
            e.preventDefault();
            const audio = new Audio(Secret);
            audio.volume = 0.2;
            audio.play().catch((error) => {
              console.error("Error al reproducir el sonido:", error);
            });
            fn();
          }
          return updatedSequence;
        });
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [active, ...deps]);

  return keySequence;
};
