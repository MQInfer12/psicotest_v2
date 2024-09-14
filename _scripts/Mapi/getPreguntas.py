import json

with open('./preguntas_mapi.txt', 'r', encoding='utf-8') as file:
  preguntas = file.readlines()

preguntas_procesadas = []

for pregunta in preguntas:
  numero, descripcion = pregunta.split('.-', 1)

  pregunta_dict = {
    "id": int(numero.strip()),
    "descripcion": descripcion.strip()
  }

  preguntas_procesadas.append(pregunta_dict)

preguntas_json = json.dumps(preguntas_procesadas, ensure_ascii=False, indent=2)

print(preguntas_json)