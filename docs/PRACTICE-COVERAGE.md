# Practice coverage (v0.11.0)

The practice scenarios teach selected core rules after the existing full lessons. They do not replace a full game or score every player. Each scenario is independent of the lesson state and supports reversible decisions. Opponents are deterministic for learning purposes.

| Game | Implemented scope | Deliberately omitted |
|---|---|---|
| Nusfjord Big Box | 2-5 players, 2 rounds; manual catch distribution, dividends, reserve; 3 turns each; scripted opponents occupy spaces; capacity checks, imitation (4/5p); gold, reserve, banquet, thinning, deforestation, share issue and market buy, ship purchase and haul change, one example building; worker return, next round | Elders and reforestation in practice, other buildings, foreign share purchases/ownership, full 7-round scoring and opponent strategy. The existing lesson covers common rules including these. |
| Race for the Galaxy | 5 players, 4 rounds; choose one of seven base action cards; opponents reveal scripted choices, phase ordering and bonuses; exploration keep/discard, development/settlement using hand as payment, military comparison, windfall/production, trade and representative consumption, hand limit and VP tracking | Full deck, complete opponent tableaux/points, full endgame, goal/takeover/prestige/search effects. Expansion modules remain in rule lessons. Cards and draws are fictional teaching examples. |

References: Lookout Games, Nusfjord Big Box English rulebook (2024), pp. 6, 8-13, https://www.lookout-spiele.de/en/games/nusfjordbigbox.html ; Rio Grande Games, Race for the Galaxy original edition rules, core action and scoring sections, https://www.riograndegames.com/games/race-for-the-galaxy/ .

Tests: deterministic randomized paths plus focused scenarios, browser navigation and actual interaction. This verifies implementation consistency, not full rulebook coverage or real novice learning outcomes.
