export type MoodKey = "happy" | "sad" | "energetic" | "romantic" | "stressed" | "chill";

const RAPID_API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const RAPID_API_HOST = "streaming-availability.p.rapidapi.com";
const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export interface Mood {
  key: MoodKey;
  label: string;
  emoji: string;
  tagline: string;
  color: string;
}

export const MOODS: Mood[] = [
  { key: "happy", label: "Happy", emoji: "😄", tagline: "Sunshine on shuffle", color: "mood-happy" },
  { key: "sad", label: "Sad", emoji: "😢", tagline: "Soft rain, soft hearts", color: "mood-sad" },
  { key: "energetic", label: "Energetic", emoji: "🔥", tagline: "Adrenaline incoming", color: "mood-energetic" },
  { key: "romantic", label: "Romantic", emoji: "💖", tagline: "Slow dance, neon lights", color: "mood-romantic" },
  { key: "stressed", label: "Stressed", emoji: "😤", tagline: "Release the tension", color: "mood-stressed" },
  { key: "chill", label: "Chill", emoji: "😌", tagline: "Lo-fi & low-key", color: "mood-chill" },
];

export interface Song {
  title: string;
  artist: string;
  duration: string;
  cover: string;
  videoId: string;
}

export interface Movie {
  title: string;
  year: number;
  rating: number;
  blurb: string;
  poster: string;
}

// 🎵 MULTI-LANGUAGE INDIVIDUAL SONGS
export async function fetchDynamicSongs(mood: string): Promise<Song[]> {
  const cleanYtKey = YT_API_KEY?.trim();
  if (!cleanYtKey) return [];
  
  try {
    const searchQuery = encodeURIComponent(`trending ${mood} songs official music video`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${searchQuery}&type=video&videoEmbeddable=true&videoDuration=medium&key=${cleanYtKey}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.items) {
      return data.items.map((item: any) => ({
        title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        artist: item.snippet.channelTitle,
        duration: "Song",
        cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        videoId: item.id.videoId
      }));
    }
  } catch (err) {
    console.error("YouTube Fetch Error:", err);
  }
  return [];
}

// 🎬 DYNAMIC CATEGORY AND MOOD MOVIE FILTER
export async function fetchDynamicMovies(mood: MoodKey, category: 'bollywood' | 'hollywood' | 'south'): Promise<Movie[]> {
  const cleanRapidKey = RAPID_API_KEY?.trim();

  if (cleanRapidKey) {
    try {
      let moodKeyword = "comedy";
      if (mood === "sad") moodKeyword = "drama";
      if (mood === "romantic") moodKeyword = "romance";
      if (mood === "energetic") moodKeyword = "action";
      if (mood === "stressed") moodKeyword = "inspiring";
      if (mood === "chill") moodKeyword = "fantasy";

      let searchQuery = `${category === "bollywood" ? "hindi" : category === "south" ? "tamil telugu" : "english"} ${moodKeyword}`;
      const url = `https://${RAPID_API_HOST}/shows/search/title?title=${encodeURIComponent(searchQuery)}&country=in&show_type=movie&limit=6`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'X-RapidAPI-Key': cleanRapidKey, 'X-RapidAPI-Host': RAPID_API_HOST }
      });

      if (res.ok) {
        const data = await res.json();
        const rawShows = data.shows || data.results || (Array.isArray(data) ? data : []);
        if (rawShows && rawShows.length > 0) {
          return rawShows.slice(0, 6).map((show: any) => ({
            title: show.title || "Cinema Hit",
            year: show.firstReleaseYear || show.year || 2025,
            rating: typeof show.rating === 'number' ? parseFloat((show.rating > 10 ? show.rating / 10 : show.rating).toFixed(1)) : 7.4,
            blurb: show.overview || `Streaming now! A perfect ${category} selection for your ${mood} vibe.`,
            poster: show.imageSet?.verticalPoster?.w480 || show.posterPath || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80"
          }));
        }
      }
    } catch (err) {
      console.error("Using backup dataset matrix:", err);
    }
  }

  // 100% Reliable Distinct Movie Database Matrix
  const masterDatabase: Record<string, Record<string, Movie[]>> = {
    bollywood: {
      happy: [
        { title: "3 Idiots", year: 2009, rating: 8.4, blurb: "Two friends search for their long lost companion in college memories.", poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80" },
        { title: "Hera Pheri", year: 2000, rating: 8.2, blurb: "Three unemployed men find an answer to all their money problems.", poster: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&q=80" }
      ],
      sad: [
        { title: "Chhichhore", year: 2019, rating: 8.3, blurb: "A tragic incident forces a middle-aged man to take a trip down memory lane.", poster: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&q=80" },
        { title: "Taare Zameen Par", year: 2007, rating: 8.4, blurb: "An inspirational journey of an artistic boy struggling with dyslexia.", poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80" }
      ],
      energetic: [
        { title: "Jawan", year: 2023, rating: 7.0, blurb: "A high-octane action thriller highlighting a personal vendetta.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80" },
        { title: "Dhoom 2", year: 2006, rating: 6.5, blurb: "A cool thief steals priceless artifacts with brilliant action setpieces.", poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80" }
      ],
      romantic: [
        { title: "Yeh Jawaani Hai Deewani", year: 2013, rating: 7.2, blurb: "A beautiful coming-of-age story about love, career, and travel.", poster: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80" },
        { title: "Jab We Met", year: 2007, rating: 7.9, blurb: "An energetic Punjabi girl changes the life of a depressed businessman.", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80" }
      ],
      stressed: [{ title: "Dear Zindagi", year: 2016, rating: 7.4, blurb: "A perfect comforting therapy film for mental peace.", poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80" }],
      chill: [{ title: "Barfi!", year: 2012, rating: 8.1, blurb: "A sweet, calming, and charming visual feel-good treat.", poster: "https://images.unsplash.com/photo-1512612254633-bf5903248f6a?w=500&q=80" }]
    },
    south: {
      happy: [{ title: "Eega (Makkhi)", year: 2012, rating: 7.7, blurb: "A murdered man is reincarnated as a fly to take revenge.", poster: "https://images.unsplash.com/photo-1608889174639-41a0c24b0308?w=500&q=80" }],
      energetic: [
        { title: "RRR", year: 2022, rating: 7.8, blurb: "Epic multi-starrer historical fiction loaded with insane action sets.", poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&q=80" },
        { title: "K.G.F: Chapter 1", year: 2018, rating: 8.2, blurb: "Rocky rises from poverty to rule the golden mines.", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80" }
      ],
      romantic: [{ title: "Sita Ramam", year: 2022, rating: 8.6, blurb: "An classic orphan army soldier receives mysterious letters from his love.", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80" }],
      sad: [{ title: "777 Charlie", year: 2022, rating: 8.8, blurb: "A lonely man's life changes beautifully after a cute dog enters his life.", poster: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&q=80" }],
      stressed: [{ title: "Jersey", year: 2019, rating: 8.5, blurb: "An emotional inspiring story of a failed cricketer trying for his son.", poster: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80" }],
      chill: [{ title: "Charlie", year: 2015, rating: 8.0, blurb: "A magical, carefree story about finding peace in small moments.", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&q=80" }]
    },
    hollywood: {
      happy: [{ title: "The Hangover", year: 2009, rating: 7.7, blurb: "Three buddies wake up from a bachelor party with no memory.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80" }],
      sad: [{ title: "The Pursuit of Happyness", year: 2006, rating: 8.0, blurb: "A struggling salesman takes custody of his son in an emotional struggle.", poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500&q=80" }],
      energetic: [{ title: "The Dark Knight", year: 2008, rating: 9.0, blurb: "Batman fights the chaos unleashed by the mastermind criminal Joker.", poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80" }],
      romantic: [{ title: "The Notebook", year: 2004, rating: 7.8, blurb: "An epic, tear-jerking classic love story across generations.", poster: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80" }],
      stressed: [{ title: "Interstellar", year: 2014, rating: 8.7, blurb: "A team of explorers travel through a wormhole in space to save humanity.", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80" }],
      chill: [{ title: "Avatar", year: 2009, rating: 7.9, blurb: "Enter the alien immersive calming world of Pandora.", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80" }]
    }
  };

  const currentCategory = masterDatabase[category] || masterDatabase.bollywood;
  return currentCategory[mood] || currentCategory.happy;
}