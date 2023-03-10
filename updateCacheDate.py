import time, os

old_cache_time = "0"
new_cache_time = str(round(time.time()))
with open("updateCacheDate.txt", "r", encoding = "utf-8") as file:
    old_cache_time = file.read()

with open("updateCacheDate.txt", "w+", encoding = "utf-8") as file:
    file.write(new_cache_time)
 
files = os.listdir("./")
for file_name in files:
    if file_name.endswith(".html"):
        file_data = ""
        with open("./" + file_name, "r", encoding = "utf-8") as file: # Открываем файл для чтения
            file_data = file.read()
        
        with open("./" + file_name, "w+", encoding = "utf-8") as file:
            file.write(file_data.replace("?update=" + old_cache_time, "?update=" + new_cache_time))