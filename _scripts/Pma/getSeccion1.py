import json

with open('./seccion1.txt', 'r', encoding='utf-8') as file:
    preguntas = file.readlines()

preguntas_procesadas = []
count = 1

for pregunta in preguntas:
    partes = pregunta.split()
    descripcion = partes[0]
    
    opciones = partes[1:]
    
    opciones_formateadas = ""
    for i in range(0, len(opciones), 2):
        opcion = opciones[i]
        texto_opcion = opciones[i+1]
        opciones_formateadas += f"<op{i//2 + 1}>{texto_opcion}</op{i//2 + 1}>"
    
    pregunta_dict = {
        "id": count,
        "descripcion": f"{descripcion}{opciones_formateadas}"
    }
    
    preguntas_procesadas.append(pregunta_dict)
    count += 1

preguntas_json = json.dumps(preguntas_procesadas, ensure_ascii=False, indent=2)

print(preguntas_json)
