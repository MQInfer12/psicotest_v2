import json

with open('./dimensiones_mapi.txt', 'r', encoding='utf-8') as file:
  textos = file.readlines()

cont_escala = 0
cont_verdadero = 1
cont_falso = 2
contador = 0

dimensiones_procesadas = []
dimensiones_dict = {
  "id": 0,
  "descripcion": "",
  "abreviacion": "",
  "items":[]
}

for texto in textos:
  if(contador == cont_escala):
    texto_separado = texto.split(":")
    descripcion = texto_separado[1].split("(")[0]
    abreviacion = texto_separado[0].split(" ")[1]
    dimensiones_dict["descripcion"] = descripcion.strip()
    dimensiones_dict["abreviacion"] = abreviacion.strip()
    cont_escala += 4
  
  if(contador == cont_verdadero):
    verdaderos = texto.split(" ")[1].split("-")
    array_verdaderos = []
    for verdadero in verdaderos:
      objeto_verdaderos = {
        "id_pregunta": int(verdadero.strip()),
        "id_opcion": 1,
        "puntuacion": 1
      }
      array_verdaderos.append(objeto_verdaderos)
    cont_verdadero += 4
  
  if(contador == cont_falso):
    falsos_exist = texto.split(" ")
    array_falsos = []
    if(len(falsos_exist) > 1):
      falsos = falsos_exist[1].split("-")
      for falso in falsos:
        objeto_falsos = {
          "id_pregunta": int(falso.strip()),
          "id_opcion": 2,
          "puntuacion": 1
        }
        array_falsos.append(objeto_falsos)
    dimensiones_dict["items"] = array_verdaderos + array_falsos
    dimensiones_dict["id"] = len(dimensiones_procesadas) + 1
    cont_falso += 4
    dimensiones_procesadas.append(dimensiones_dict.copy())

  contador += 1


dimensiones_json = json.dumps(dimensiones_procesadas, ensure_ascii=False, indent=2)

print(dimensiones_json)

# Para ver si cada dimension tiene los items
# for valor in dimensiones_procesadas:
#   print(valor["descripcion"],len(valor["items"]))