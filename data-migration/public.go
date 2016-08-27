package main

type public struct {
	Teams   map[string]publicTeam   `json:"teams"`
	Players map[string]publicPlayer `json:"players"`
}

type publicTeam struct {
	IsFull     bool   `json:"isFull"`
	Name       string `json:"name"`
	Popularity int    `json:"popularity"`
}

type publicPlayer struct {
	Name       string `json:"name"`
	Popularity int    `json:"popularity"`
}

func GetNewPublic(teamData map[string]interface{}, playerData map[string]interface{}) (public, error) {
	// team
	teams := make(map[string]publicTeam)
	for k, v := range teamData {
		t := v.(map[string]interface{})

		// name
		pt := publicTeam{IsFull: false, Popularity: 0}
		if val, ok := t["name"]; ok {
			pt.Name = val.(string)
		}
		teams[k] = pt
	}

	// player
	players := make(map[string]publicPlayer)
	for k, v := range playerData {
		t := v.(map[string]interface{})

		// name
		pp := publicPlayer{Popularity: 0}
		if val, ok := t["displayName"]; ok {
			pp.Name = val.(string)
		}
		players[k] = pp
	}

	// public
	p := public{Teams: teams, Players: players}

	return p, nil
}
