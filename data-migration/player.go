package main

type player struct {
	Basic  playerBasic  `json:"basic-info"`
	Detail playerDetail `json:"detail-info"`
	Teams  interface{}  `json:"teams"`
}

type playerBasic struct {
	Name   string `json:"name"`
	Photo  string `json:"photo,omitempty"`
	TeamId string `json:"teamId,omitempty"`
}

type playerDetail struct {
	Foot     string  `json:"foot,omitempty"`
	Height   float64 `json:"height,omitempty"`
	Position string  `json:"position,omitempty"`
	Slogan   string  `json:"slogan,omitempty"`
	Weight   float64 `json:"weight,omitempty"`
}

func GetNewPlayers(data map[string]interface{}) (map[string]player, error) {
	players := make(map[string]player)
	for k, v := range data {
		m := v.(map[string]interface{})

		// basic
		b := playerBasic{}
		if val, ok := m["currentTeamId"]; ok {
			b.TeamId = val.(string)
		}
		if val, ok := m["displayName"]; ok {
			b.Name = val.(string)
		}
		if val, ok := m["photoURL"]; ok {
			b.Photo = val.(string)
		}

		// detail
		d := playerDetail{}
		if val, ok := m["foot"]; ok {
			d.Foot = val.(string)
		}
		if val, ok := m["height"]; ok {
			d.Height = val.(float64)
		}
		if val, ok := m["position"]; ok {
			d.Position = val.(string)
		}
		if val, ok := m["weight"]; ok {
			d.Weight = val.(float64)
		}

		// player
		p := player{Basic: b, Detail: d, Teams: m["teams"]}
		players[k] = p
	}

	/*
		playerData, err := json.Marshal(players)
		if err != nil {
			return nil, err
		}
	*/

	return players, nil
}
