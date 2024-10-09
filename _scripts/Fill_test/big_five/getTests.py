import pandas as pd
import json
import os



df = pd.read_csv('./big_five_results.csv')

email_control = df.loc[0, 'email']
nombre_control = df.loc[0, 'nombre']
perfil_control = df.loc[0,'perfil']
edad_control = df.loc[0,'edad']
fecha_control = df.loc[0,'created_at']
answers = []
objeto = []

for index, row in df.iterrows():
  idPregunta = int(row['id_pregunta']) 
  idOpcion = int(row['id_reactivo'])

  if(row['email'] != email_control):
    objeto.append({
      "email": 'rolando.lopez@unifranz.edu.bo' if email_control == 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo' 
        else 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo' 
        if email_control == 'maummq@gmail.com'
        else email_control,
      "nombre": 'Humberto Rolando Lopez' if email_control == 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo' 
        else 'MAURICIO SANTIAGO MOLINA QUINTEROS'
        if email_control == 'maummq@gmail.com'
        else nombre_control,
      "foto": None if pd.isna(perfil_control) 
        else 'https://lh3.googleusercontent.com/a-/ALV-UjWQ8RwnQHGuqFmvWd709DQdtXFRpaZZ5hR8fjU2ptarwpJT9A=s272-p-k-rw-no' 
        if email_control == 'cbbe.mauriciosantiago.molina.qu@unifranz.edu.bo' 
        else 'https://lh3.googleusercontent.com/a/ACg8ocIpR6jiZMAwqRKwZIDWyLoFxZCYPQQ4NzMkBAe-AS3y75491vA=s96-c'
        if email_control == 'maummq@gmail.com'
        else perfil_control,
      "edad": None if pd.isna(edad_control) | (edad_control == 0) else edad_control,
      "fecha": fecha_control,
      "respuestas": answers
    })
    email_control = row['email']
    nombre_control = row['nombre']
    perfil_control = row['perfil']
    edad_control = row['edad']
    fecha_control = row['created_at']
    answers = []
    if(idPregunta > 36):
       idPregunta = idPregunta - 1
    answers.append({
      "idPregunta": int(idPregunta),
      "idOpcion": int(idOpcion)
    })
  else:
    if(idPregunta > 36):
       idPregunta = idPregunta - 1
    answers.append({
      "idPregunta": int(idPregunta),
      "idOpcion": int(idOpcion)
    })

objeto.append({
    "email": email_control,
    "nombre": nombre_control,
    "foto": None if pd.isna(perfil_control) else perfil_control,
    "edad": None if pd.isna(edad_control) | (edad_control == 0) else edad_control,
    "fecha": fecha_control,
    "respuestas": answers
})

for obj in objeto:
    obj['edad'] = int(obj['edad']) if obj['edad'] is not None else None
    for answer in obj['respuestas']:
        answer['idPregunta'] = int(answer['idPregunta'])
        answer['idOpcion'] = int(answer['idOpcion'])

objeto_json = json.dumps(objeto, ensure_ascii=False, indent=2)

ruta_json = os.path.join('./', 'respuesta.json')

# Escribir los datos JSON en un archivo
with open(ruta_json, 'w', encoding='utf-8') as json_file:
    json_file.write(objeto_json)

print(f'Archivo JSON exportado en: {ruta_json}')
