// src/api/matchApi.ts

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