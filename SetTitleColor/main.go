package main

import (
    "encoding/json"
    "log"
    "os"
)

func main() {

    colorCodePath := "./color_codes.json"
    dirPath := "../ref/assets/minecraft/lang/"
    uploadPath := "../asterium/assets/minecraft/lang/"

    data1, colorCodeErr1 := os.ReadFile(colorCodePath)
    if colorCodeErr1 != nil {
        log.Fatal(colorCodeErr1)
        return
    }

    var colorCodes map[string]interface{}
    colorCodeErr2 := json.Unmarshal(data1, &colorCodes)
    if colorCodeErr2 != nil {
        log.Fatal(colorCodeErr2)
        return
    }

    f, _ := os.Open(dirPath)
    files, _ := f.Readdir(0)

    for _, file := range files {
        filePath := dirPath + file.Name()
        data2, langErr1 := os.ReadFile(filePath)
        if langErr1 != nil {
            log.Fatal(langErr1)
            return
        }

        var lang map[string]interface{}
        langErr2 := json.Unmarshal(data2, &lang)
        if langErr2 != nil {
            log.Fatal(langErr2)
            return
        }

        for key, value := range colorCodes {
            lang[key] = "§" + value.(string) + lang[key].(string)
        }

        updatedData, err := json.MarshalIndent(lang, "", "  ")
        if err != nil {
            log.Fatal(err)
            return
        }

        err = os.WriteFile(uploadPath+file.Name(), updatedData, 0644)
        if err != nil {
            log.Fatal(err)
            return
        }
    }
}
