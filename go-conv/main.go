package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	docconv "code.sajari.com/docconv/v2"
	"github.com/xuri/excelize/v2"
)

func errorResult() {
	output := map[string]interface{}{"success": false}
	jsonString, _ := json.Marshal(output)
	fmt.Println(string(jsonString))
}

func getFileType(filePath string) string {
	splitFilePath := strings.Split(filePath, "/")
	filename := splitFilePath[len(splitFilePath)-1]
	splitFilename := strings.Split(filename, ".")
	fileType := splitFilename[len(splitFilename)-1]
	return fileType
}

func ReadXLSX(filePath string) {
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	sheets := f.GetSheetList()
	var sheetsData []string
	for _, sheet := range sheets {
		data := ""
		rows, err := f.GetRows(sheet)
		if err != nil {
			fmt.Println(err)
			return
		}
		for _, row := range rows {
			for _, colCell := range row {
				data = data + colCell
			}
			fmt.Println()
		}
		sheetsData = append(sheetsData, data)
	}
	output := map[string]interface{}{"success": true, "body": sheetsData}
	jsonString, _ := json.Marshal(output)
	fmt.Println(string(jsonString))
}

func readDocs(filePath string) {
	res, err := docconv.ConvertPath(filePath)
	if err != nil {
		errorResult()
		return
	}
	output := map[string]interface{}{"success": true, "body": res.Body}
	jsonString, _ := json.Marshal(output)
	fmt.Println(string(jsonString))
}

// func getRecent() {
//     dir := `C:\temp\`
//     files, err := ioutil.ReadDir(dir)
//     if err != nil {
//         fmt.Fprintln(os.Stderr, err)
//         os.Exit(1)
//     }
//     var modTime time.Time
//     var names []string
//     for _, fi := range files {
//         if fi.Mode().IsRegular() {
//             if !fi.ModTime().Before(modTime) {
//                 if fi.ModTime().After(modTime) {
//                     modTime = fi.ModTime()
//                     names = names[:0]
//                 }
//                 names = append(names, fi.Name())
//             }
//         }
//     }
//     if len(names) > 0 {
//         fmt.Println(modTime, names)
//     }
// }

func main() {
	if len(os.Args) != 2 {
		errorResult()
		return
	}

	filePath := os.Args[1]

	fileType := getFileType(filePath)

	// fmt.Println(fileType)
	if fileType == "xlsx" {
		ReadXLSX(filePath)
	} else {
		readDocs(filePath)
	}
}
