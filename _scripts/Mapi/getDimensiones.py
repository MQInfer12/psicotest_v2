import json
import re

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
        "puntuacion": 1,
        "condiciones":[
          {
          "id_pregunta": int(verdadero.strip()),
          "id_opcion": 1,
          }
        ]
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
          "puntuacion": 1,
          "condiciones": [
            {
              "id_pregunta": int(falso.strip()),
              "id_opcion": 2,
            }
          ]
        }
        array_falsos.append(objeto_falsos)
    dimensiones_dict["items"] = array_verdaderos + array_falsos
    dimensiones_dict["id"] = len(dimensiones_procesadas) + 1
    cont_falso += 4
    dimensiones_procesadas.append(dimensiones_dict.copy())

  contador += 1

# Para dimension de incoherencia
dimensiones_dict["id"] = len(dimensiones_procesadas) + 1
dimensiones_dict["descripcion"] = "INDICE DE INCOHERENCIA"
dimensiones_dict["abreviacion"] = ""

def split_number_and_letter(s):
    match = re.match(r"(\d+)([VF])", s)  # Solo coincide con V o F
    if match:
        return match.groups()
    return None

textos_incoherencias = ["1V-137V",
          "1F-137F",
          "2V-132V",
          "2F-132F",
          "3V-126V",
          "3F-126F",
          "4V-17F",
          "4F-17V",
          "12V-140F",
          "12F-140V",
          "20V-74V",
          "20F-74F",
          "23V-119V",
          "23F-119F",
          "25V-110V",
          "25F-110F",
          "27V-76F",
          "27F-76V",
          "29V-123V",
          "29F-123F",
          "32V-73V",
          "32F-73F",
          "43V-66F",
          "43F-66V",
          "45V-144F",
          "45F-144V",
          "54V-97V",
          "54F-97F",
          "68V-100V",
          "68F-100F",
          "104V-143F",
          "104F-143V"]

incoherencias = []

for texto in textos_incoherencias:

  first_value = split_number_and_letter(texto.split("-")[0])
  second_value = split_number_and_letter(texto.split("-")[1])
  first_number = first_value[0]
  first_option = 0
  second_number = second_value[0]
  second_option = 0

  if(first_value[1] == 'V'):
    first_option = 1
  else:
    first_option = 2
  if(second_value[1] == 'V'):
    second_option = 1
  else:
    second_option = 2

  array_incoherencia = {
    "puntuacion": 1,
    "condiciones": [  
      {
        "id_pregunta": int(first_number.strip()),
        "id_opcion": first_option,
      },
      {
        "id_pregunta": int(second_number.strip()),
        "id_opcion": second_option,
      }
    ]
  }

  incoherencias.append(array_incoherencia)
dimensiones_dict["items"] = incoherencias

dimensiones_procesadas.append(dimensiones_dict.copy())

dimensiones_json = json.dumps(dimensiones_procesadas, ensure_ascii=False, indent=2)

print(dimensiones_json)

# Para ver si cada dimension tiene los items
# for valor in dimensiones_procesadas:
#   print(valor["descripcion"],len(valor["items"]))