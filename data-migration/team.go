package main

type team struct {
	Basic   teamBasic         `json:"basic-info"`
	Detail  teamDetail        `json:"detail-info"`
	Members map[string]member `json:"members"`
}

type teamBasic struct {
	Logo string `json:"logo"`
	Name string `json:"name"`
}

type teamDetail struct {
	Captain     string `json:"captain"`
	Description string `json:"description,omitempty"`
	Founder     string `json:"founder"`
	Manager     string `json:"manager,omitempty"`
}

type member struct {
	Number int `json:"number,omitempty"`
	Goals  int `json:"goals"`
}

func GetNewTeams(data map[string]interface{}) (map[string]team, error) {
	teams := make(map[string]team)
	for k, v := range data {
		t := v.(map[string]interface{})

		// basic
		b := teamBasic{}
		if val, ok := t["name"]; ok {
			b.Name = val.(string)
		}
		if val, ok := t["logo"]; ok {
			b.Logo = val.(string)
		}

		// detail
		d := teamDetail{}
		if val, ok := t["captain"]; ok {
			d.Captain = val.(string)
		}
		if val, ok := t["founder"]; ok {
			d.Founder = val.(string)
		}

		// member
		m := make(map[string]member)
		if val, ok := t["players"]; ok {
			players := val.(map[string]interface{})
			for km := range players {
				m[km] = member{Goals: 0}
			}
		}

		// team
		newT := team{Basic: b, Detail: d, Members: m}
		teams[k] = newT
	}

	/*
		playerData, err := json.Marshal(players)
		if err != nil {
			return nil, err
		}
	*/

	return teams, nil
}
