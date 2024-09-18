import json

with open('./escalas.txt', 'r', encoding='utf-8') as file:
  textos = file.readlines()

conversiones = []
escalas_dict = {
    "edad_minima": 0,
    "edad_maxima": 0,
    "genero": "",
    "dimensiones": []
}
dimensiones = []
mapeo_obj = {}
cont_edad = 0
cont_dimension = 0

for texto in textos:
    if(texto == '\n'):
        if(cont_dimension > 0):
            nueva_dimension = {
                "id_dimension": cont_dimension,
                "mapeo": mapeo_obj
            }
            dimensiones.append(nueva_dimension.copy())
            mapeo_obj = {}
        continue

    if("Varones" in texto or "Mujeres" in texto):
        if(cont_edad > 0):
            escalas_dict["dimensiones"] = dimensiones
            conversiones.append(escalas_dict.copy())
            cont_dimension = 0
            cont_edad = 0
            dimensiones = []


        datos_generales = texto.split(" ")
        escalas_dict["genero"] = "Hombre" if datos_generales[0].strip() == "Varones" else "Mujer"
        escalas_dict["edad_minima"] = int(datos_generales[1].split("-")[0].strip())
        escalas_dict["edad_maxima"] = int(datos_generales[1].split("-")[1].strip())
        cont_edad += 1
        continue
    
    if("Para" in texto):
        cont_dimension += 1
        continue
    
    nuevo_mapeo_obj = {
        texto.split(":")[1].strip() : int(texto.split(":")[0].strip()) 
    }
    mapeo_obj.update(nuevo_mapeo_obj.copy())

nueva_dimension = {
    "id_dimension": cont_dimension,
    "mapeo": mapeo_obj
}
dimensiones.append(nueva_dimension.copy())
escalas_dict["dimensiones"] = dimensiones
conversiones.append(escalas_dict.copy())

conversiones_json = json.dumps(conversiones, ensure_ascii=False, indent=2)

print(conversiones_json)
    

