package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
	newData := make(map[string]interface{})
	// parsing old json file
	oldFile, err := ioutil.ReadFile("./old.json")
	if err != nil {
		fmt.Printf("File error: %v\n", err)
		os.Exit(1)
	}

	var oldJsonFile map[string]map[string]interface{}
	json.Unmarshal(oldFile, &oldJsonFile)

	// get players
	playerData, err := GetNewPlayers(oldJsonFile["players"])
	check(err)
	newData["players"] = playerData

	// get teams
	teamData, err := GetNewTeams(oldJsonFile["teams"])
	check(err)
	newData["teams"] = teamData

	// get public
	publicData, err := GetNewPublic(oldJsonFile["teams"], oldJsonFile["players"])
	check(err)
	newData["public"] = publicData

	// export new data
	exportNewData(newData)
}

func exportNewData(data map[string]interface{}) {
	f, err := os.Create("newData.json")
	check(err)
	defer f.Close()
	jsonData, err := json.Marshal(data)
	check(err)
	_, err = f.Write(jsonData)
	check(err)

}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
