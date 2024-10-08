import pandas as pd
import os
import json
import re

#Para DANIELA TRUJILLO columna sexo esta en columna df.iloc[2,28], lo normal es df.iloc[2,26]
ruta_carpeta = './tests/VALERIA AGUILAR'

# Obtener una lista de todos los archivos Excel en la carpeta, ignorando archivos temporales
archivos_excel = [archivo for archivo in os.listdir(ruta_carpeta) 
                  if archivo.endswith('.xlsx') and not archivo.startswith('~$')]

datos = []

# Para factor V
opcion_v_mapeo = {
  'a': 1,
  'b': 2,
  'c': 3,
  'd': 4
}

# Para factor E
opcion_e_mapeo = {
  'a': 5,
  'b': 6,
  'c': 7,
  'd': 8,
  'e': 9,
  'f': 10
}

# Para factor R
archivo_r_json = './section_r_preguntas.json'
with open(archivo_r_json, 'r', encoding='utf-8') as file:
    datos_r = json.load(file)

opcion_r_mapeo = {
  0: 11,
  1: 12,
  2: 13,
  3: 14,
  4: 15,
  5: 16
}

def extraer_opciones(descripcion):
  opciones = re.findall(r'<op\d+>(.*?)</op\d+>', descripcion)
  return opciones

for item in datos_r:
  item['descripcion'] = extraer_opciones(item['descripcion'])

# Para factor N
opcion_n_mapeo = {
"b":17,
"m":18
}


for archivo in archivos_excel:
  print(archivo)
  # Combina la ruta de la carpeta con el nombre del archivo
  ruta_archivo = os.path.join(ruta_carpeta, archivo)
  df = pd.read_excel(ruta_archivo, sheet_name='Plantilla PMA')

  respuestas = []
  # Extraer los datos necesarios
  nombre = df.iloc[1, 13]
  edad = df.iloc[2, 13]
  sexo = "Hombre" if (df.iloc[2,26].lower() == "masculino" or df.iloc[2,26].lower() == "m") else "Mujer" if (df.iloc[2,26].lower() == "femenino" or df.iloc[2,26].lower() == "f") else None
  colegio = df.iloc[3, 13]
  cel = df.iloc[4, 13]
  correo = correo = "_".join(parte.lower() for parte in nombre.split(" ")) + "@psicotest.com"


  # Para factor V
  for i in range (7,32):
    if(df.iloc[i,3] != "" and pd.notna(df.iloc[i,3])):
      respuestas_obj = {
        "id_pregunta": int(df.iloc[i,1]),
        "id_opcion": opcion_v_mapeo.get(df.iloc[i,3].lower())
      }
      respuestas.append(respuestas_obj)

  for i in range (7,32):
    if(df.iloc[i,7] != "" and pd.notna(df.iloc[i,7])):
      respuestas_obj = {
        "id_pregunta": int(df.iloc[i,5]),
        "id_opcion": opcion_v_mapeo.get(df.iloc[i,7].lower())
      }
      respuestas.append(respuestas_obj)
  
  # Para factor E
  for i in range (7,27):
    resps = []
    if(df.iloc[i,13] != "" and pd.notna(df.iloc[i,13])):
      resps.append(opcion_e_mapeo.get(df.iloc[i,13].lower()))
    
    if(df.iloc[i,14] != "" and pd.notna(df.iloc[i,14])):
      resps.append(opcion_e_mapeo.get(df.iloc[i,14].lower()))
    
    if(df.iloc[i,15] != "" and pd.notna(df.iloc[i,15])):
      resps.append(opcion_e_mapeo.get(df.iloc[i,15].lower()))
    
    if(len(resps) > 0):
      respuestas.append({
        "id_pregunta": int(df.iloc[i,9]) + 50,
        "id_opcion": resps
      })
  # Para factor R
  for i in range (7,37):
    valor = df.iloc[i, 22]
    if(valor != "" and pd.notna(valor)):
      exists = next((item for item in datos_r if item['id'] == df.iloc[i,20]), None)
      if(exists is not None and valor.lower() in exists['descripcion']):
        position = exists['descripcion'].index(valor.lower())
        if(position is not None and opcion_r_mapeo.get(position) is not None):
          respuestas.append({
            "id_pregunta": int(df.iloc[i,20]) + 70,
            "id_opcion": opcion_r_mapeo.get(position)
          })
  # Para factor N
  for i in range (7,37):
    if(df.iloc[i,26] != "" and pd.notna(df.iloc[i,26]) and opcion_n_mapeo.get(df.iloc[i,26].lower()) is not None):
      respuestas.append({
        "id_pregunta": int(df.iloc[i,24]) + 100,
        "id_opcion": opcion_n_mapeo.get(df.iloc[i,26].lower())
      })
  for i in range (7,37):
    if(df.iloc[i,28] != "" and pd.notna(df.iloc[i,30]) and opcion_n_mapeo.get(df.iloc[i,30].lower()) is not None):
      respuestas.append({
        "id_pregunta": int(df.iloc[i,28]) + 100,
        "id_opcion": opcion_n_mapeo.get(df.iloc[i,30].lower())
      })
  for i in range (7,17):
    if(df.iloc[i,32] != "" and pd.notna(df.iloc[i,34]) and opcion_n_mapeo.get(df.iloc[i,34].lower()) is not None):
      respuestas.append({
        "id_pregunta": int(df.iloc[i,32]) + 100,
        "id_opcion": opcion_n_mapeo.get(df.iloc[i,34].lower())
      })

  # Para factor F
  palabras = df.iloc[7,36]
  if(palabras != "" and pd.notna(palabras)):
    palabra_idopcion = []
    for i in range(1, int(palabras) + 1):
      palabra_idopcion.append({
        "id": i,
        "correct": True,
        "word": "Palabra " + str(i)
      })
    respuestas.append({
      "id_pregunta": 171,
      "id_opcion": palabra_idopcion
    })
      
  objeto =  {
    "datos_generales":{
      "nombre":nombre,
      "edad":edad,
      "sexo":sexo,
      "colegio":colegio,
      "cel":cel,
      "correo":correo,
    },
    "respuestas":respuestas
  }
  datos.append(objeto)


datos_json = json.dumps(datos, ensure_ascii=False, indent=2)

# print(datos_json)



nombre_archivo_json = 'resultados.json'  # Puedes cambiar el nombre como desees
ruta_json = os.path.join(ruta_carpeta, nombre_archivo_json)

# Escribir los datos JSON en un archivo
with open(ruta_json, 'w', encoding='utf-8') as json_file:
    json_file.write(datos_json)

print(f'Archivo JSON exportado en: {ruta_json}')
