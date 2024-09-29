import json

with open('./seccion2.txt', 'r', encoding='utf-8') as file:
    preguntas = file.readlines()

preguntas_procesadas = []

count = 71
for pregunta in preguntas:
  partes = pregunta.split('|')
  
  if len(partes) == 2:
    texto, opciones = partes
    texto = texto.strip()
    opciones = opciones.strip().split()
    
    descripcion = texto
    for i, opcion in enumerate(opciones):
      descripcion += f"<op{i+11}>{opcion}</op{i+11}>"

    pregunta_dict = {
      "id": count,
      "align": "center",
      "descripcion": descripcion
    }
    
    preguntas_procesadas.append(pregunta_dict)
    count += 1

preguntas_json = json.dumps(preguntas_procesadas, ensure_ascii=False, indent=2)

print(preguntas_json)
