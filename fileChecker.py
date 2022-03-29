import os
import json

def getImages(paths):
    images = []
    for path in paths:
        for filename in os.listdir(path):
            if os.path.isfile(os.path.join(path, filename)):
                namePath = path[path.index(path) + len(path):]
                images.append({
                    "name": namePath + filename[0:filename.index(".png")],
                    "src": path + filename
                })
            else:
                subImages = getImages(path + filename + "/")
                images.extend(subImages)
    return images

output = open("files.json", "w")
output.write(json.dumps(getImages(["images/", "blockImages/", "spriteImages/"])))
output.close()