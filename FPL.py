import requests
import pandas as pd

BOOTSTRAP_URL = "https://fantasy.premierleague.com/api/bootstrap-static/"
FIXTURES_URL = "https://fantasy.premierleague.com/api/fixtures/"

# Load bootstrap (teams)
bootstrap = requests.get(BOOTSTRAP_URL).json()
teams_df = pd.DataFrame(bootstrap["teams"])

# Load fixtures
fixtures = pd.DataFrame(requests.get(FIXTURES_URL).json())

# Function: get team id by short_name
def team_id(short_name):
    return teams_df.loc[teams_df["short_name"] == short_name, "id"].iloc[0]

# Teams we want
teams_list = ["BHA", "AVL", "CHE", "NEW"]

# Target gameweeks
target_gws = [12, 13, 14]
fixtures_target = fixtures[fixtures["event"].isin(target_gws)]

# Prepare results
result = {}
for code in teams_list:
    tid = team_id(code)
    opps = []
    for gw in target_gws:
        fix = fixtures_target[(fixtures_target["event"] == gw) &
                              ((fixtures_target["team_h"] == tid) | (fixtures_target["team_a"] == tid))]
        if fix.empty:
            opps.append(None)
        else:
            row = fix.iloc[0]
            opp_id = row["team_a"] if row["team_h"] == tid else row["team_h"]
            opp_code = teams_df.loc[teams_df.id == opp_id, "short_name"].iloc[0]
            opps.append(opp_code)
    result[code] = opps

# Convert to DataFrame
df_result = pd.DataFrame(result, index=[f"GW{gw}" for gw in target_gws]).T

print("\n=== Opponents for Brighton, Aston Villa, Chelsea, Newcastle in GW12-14 ===")
print(df_result)

# Save to Excel if needed
df_result.to_excel("selected_teams_opponents.xlsx")
