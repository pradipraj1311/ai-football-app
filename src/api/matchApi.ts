
const API_URL = 'https://e2match.vercel.app/api/live-matches';

export const fetchLiveMatches = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (response.status === 503) {
      console.warn("Server is under maintenance.");
      return [];
    }

    const data = await response.json();
    
    if (!data || !data.matches) {
      return [];
    }

    return data.matches.map((m: any) => ({
      id: String(m.id),
      home: m.homeTeam?.name || 'Home',
      away: m.awayTeam?.name || 'Away',
      homeScore: m.homeScore ?? 0,
      awayScore: m.awayScore ?? 0,
      time: m.status === 'LIVE' ? `${m.minute}'` : (m.time || 'TBD'),
      hasHighlight: !!m.youtubeHighlightId
    }));

  } catch (error) {
    console.error("Error fetching match data:", error);
    return [];
  }

};

export const fetchAiPrediction = async (match: any) => {
  try {
    const response = await fetch('https://e2match.vercel.app/api/predict', {
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
    const response = await fetch(`https://e2match.vercel.app/api/standings?tournamentId=${tournamentId}&seasonId=${seasonId}`);
    
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
