import json

preguntas_procesadas = []

count = 101
for i in range(70):
  pregunta_dict = {
    "id": count,
    "type": "image",
    "descripcion": f"/pma/seccion4/{i + 101}.png"
  }

  preguntas_procesadas.append(pregunta_dict)
  count += 1

preguntas_json = json.dumps(preguntas_procesadas, ensure_ascii=False, indent=2)

print(preguntas_json)