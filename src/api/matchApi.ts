const API_BASE_URL = 'https://e2match.vercel.app/api';

const mapMatch = (m: any) => ({
  ...m,
  id: String(m.id),
  home: m.homeTeam?.name || 'Home',
  away: m.awayTeam?.name || 'Away',
  homeScore: m.homeScore ?? 0,
  awayScore: m.awayScore ?? 0,
  time: m.status === 'LIVE' ? `${m.minute}'` : (m.time || 'TBD'),
  hasHighlight: !!m.youtubeHighlightId,
});

const fetchMatchesByEndpoint = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);

    if (response.status === 503) {
      console.warn("Server is under maintenance.");
      return [];
    }

    if (!response.ok) {
      console.error(`Failed to fetch from ${endpoint}. Status: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data || !data.matches) {
      return [];
    }

    return data.matches.map(mapMatch);
  } catch (error) {
    console.error(`Error fetching match data from ${endpoint}:`, error);
    return [];
  }
};

export const fetchLiveMatches = () => fetchMatchesByEndpoint('live-matches');
export const fetchUpcomingMatches = () => fetchMatchesByEndpoint('upcoming-matches');
export const fetchCompletedMatches = () => fetchMatchesByEndpoint('completed-matches');

export const fetchAiPrediction = async (match: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ match })
    });

    const data = await response.json();
    return data.prediction || null;
  } catch (error) {
    console.error("Error fetching AI prediction:", error);
    return null;
  }
};

export const fetchStandings = async (tournamentId = '16', seasonId = '52186') => {
  try {
    const response = await fetch(`${API_BASE_URL}/standings?tournamentId=${tournamentId}&seasonId=${seasonId}`);

    if (response.status === 503) {
      console.warn("Server is under maintenance.");
      return [];
    }

    const data = await response.json();
    return data.standings || [];
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
};

export const fetchTeams = async () => {
  try {
    // NOTE: This is a hypothetical endpoint. You would need to create this on your backend.
    const response = await fetch(`${API_BASE_URL}/teams`);
    if (!response.ok) {
      console.warn("Could not fetch teams from API, falling back to local data.");
      return null; // Return null to indicate fallback
    }
    const data = await response.json();
    // Handle both cases: API returns an array directly, or an object with a 'teams' property.
    if (Array.isArray(data)) {
      return data;
    }
    return data.teams || [];
  } catch (error) {
    console.error("Error fetching teams data:", error);
    return null; // Return null to indicate fallback
  }
};
