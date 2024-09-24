import json

with open('./preguntas_kuder.txt', 'r', encoding='utf-8') as file:
  preguntas = file.readlines()

preguntas_procesadas = []

count = 1
for pregunta in preguntas:
  descripcion = pregunta

  pregunta_dict = {
    "id": count,
    "descripcion": descripcion.strip()
  }

  preguntas_procesadas.append(pregunta_dict)
  count += 1

preguntas_json = json.dumps(preguntas_procesadas, ensure_ascii=False, indent=2)

print(preguntas_json)