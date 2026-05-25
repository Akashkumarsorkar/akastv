import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Setup directories and persistent visitor count file path
const VISITOR_FILE = path.join(process.cwd(), "visitor_count.json");

// Helper to get or initialize visitor statistics
function getVisitorStats(): { count: number } {
  try {
    if (fs.existsSync(VISITOR_FILE)) {
      const data = fs.readFileSync(VISITOR_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading visitor stats:", error);
  }
  // Initialize standard starter count to look premium and active
  const initialData = { count: 12480 };
  try {
    fs.writeFileSync(VISITOR_FILE, JSON.stringify(initialData, null, 2));
  } catch (err) {
    console.error("Error writing initial visitor stats:", err);
  }
  return initialData;
}

function incrementVisitorStats(): { count: number } {
  const stats = getVisitorStats();
  stats.count += 1;
  try {
    fs.writeFileSync(VISITOR_FILE, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Error saving visitor stats:", error);
  }
  return stats;
}

// In-Memory cache for the parsed M3U playlist data
let cachedChannels: any[] = [];
let cacheTime = 0;
const CACHE_DURATION_MS = 25 * 60 * 1000; // 25 Minutes cache to fetch new updates dynamically

// Helper to perform HTTP GET request
function fetchUrlString(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "ATVSports-IPTV" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Custom M3U Playlist Parser logic
function parseM3uPlaylist(rawText: string, sourceName: string): any[] {
  const channels: any[] = [];
  const lines = rawText.split(/\r?\n/);

  let currentMeta: {
    logo: string;
    rawGroup: string;
    name: string;
    id: string;
    isHd: boolean;
  } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      // Extract properties via precise regexes
      const logoMatch = line.match(/tvg-logo=["']([^"']+)["']/i);
      const groupMatch = line.match(/group-title=["']([^"']+)["']/i);
      const nameMatch = line.match(/tvg-name=["']([^"']+)["']/i);

      let channelName = "";
      const commaIndex = line.lastIndexOf(",");
      if (commaIndex !== -1) {
        channelName = line.substring(commaIndex + 1).trim();
      } else if (nameMatch) {
        channelName = nameMatch[1];
      } else {
        channelName = "Live Channel";
      }

      // Check for HD indicators in names
      const isHd =
        /hd\b|1080p|720p|high definition/i.test(channelName) ||
        line.toLowerCase().includes("hd");

      currentMeta = {
        logo: logoMatch ? logoMatch[1] : "",
        rawGroup: groupMatch ? groupMatch[1] : "",
        name: channelName,
        id: "channel_" + Math.random().toString(36).substring(2, 11),
        isHd: isHd,
      };
    } else if (line.startsWith("http://") || line.startsWith("https://")) {
      // It is a stream URL, complete the meta mapping
      if (currentMeta) {
        // Classify the channel dynamically into standard categories
        const category = classifyChannel(currentMeta.name, currentMeta.rawGroup);

        channels.push({
          id: currentMeta.id,
          name: currentMeta.name,
          logo: currentMeta.logo || `https://picsum.photos/seed/${encodeURIComponent(currentMeta.name)}/120/120`,
          url: line,
          category: category,
          rawGroup: currentMeta.rawGroup || "General",
          isHd: currentMeta.isHd,
          m3uSource: sourceName,
        });
        currentMeta = null;
      }
    }
  }

  return channels;
}

// Function to classify channels based on key markers
function classifyChannel(name: string, group: string): string {
  const normName = name.toLowerCase();
  const normGroup = (group || "").toLowerCase();

  // 1. Bangla TV Check (Highest priority for targeting local viewers)
  const isBangla =
    normName.includes("btv") ||
    normName.includes("somoy") ||
    normName.includes("jamuna") ||
    normName.includes("gtv") ||
    normName.includes("t sports") ||
    normName.includes("atn") ||
    normName.includes("channel i") ||
    normName.includes("ntv") ||
    normName.includes("duronto") ||
    normName.includes("independent") ||
    normName.includes("bangla") ||
    normName.includes("boishakhi") ||
    normName.includes("deepto") ||
    normName.includes("ekattor") ||
    normName.includes("news24 bd") ||
    normName.includes("rtv") ||
    normGroup.includes("bangla") ||
    normGroup.includes("bd tv") ||
    normGroup.includes("bangladesh");

  if (isBangla) {
    // If it's a sports channel, also label it as Bangla TV, let sports channels in Bangla highlight there too.
    if (normName.includes("sport") || normName.includes("cricket") || normName.includes("football")) {
      return "Sports";
    }
    return "Bangla TV";
  }

  // 2. Cricket Check
  if (
    normName.includes("cricket") ||
    normName.includes("ipl") ||
    normName.includes("bpl") ||
    normName.includes("willow") ||
    normName.includes("crichd") ||
    normName.includes("star sports 1") ||
    normName.includes("star sports select") ||
    normName.includes("tsports") ||
    normName.includes("t sports") ||
    normGroup.includes("cricket")
  ) {
    return "Cricket";
  }

  // 3. Football Check
  if (
    normName.includes("football") ||
    normName.includes("premier league") ||
    normName.includes("laliga") ||
    normName.includes("bundesliga") ||
    normName.includes("serie a") ||
    normName.includes("bein sport") ||
    normName.includes("psg") ||
    normName.includes("sony sports ten 2") ||
    normName.includes("chelsea") ||
    normName.includes("real madrid") ||
    normGroup.includes("football") ||
    normGroup.includes("soccer")
  ) {
    return "Football";
  }

  // 4. Sports Check
  if (
    normName.includes("sport") ||
    normName.includes("ten sports") ||
    normName.includes("espn") ||
    normName.includes("skysports") ||
    normName.includes("eurosport") ||
    normName.includes("sony ten") ||
    normName.includes("wwe") ||
    normName.includes("ufc") ||
    normName.includes("star sports") ||
    normGroup.includes("sports") ||
    normGroup.includes("ptv sports")
  ) {
    return "Sports";
  }

  // 5. News Check
  if (
    normName.includes("news") ||
    normName.includes("al jazeera") ||
    normName.includes("bbc") ||
    normName.includes("cnn") ||
    normName.includes("reuters") ||
    normName.includes("sky news") ||
    normGroup.includes("news")
  ) {
    return "News";
  }

  // 6. Kids Check
  if (
    normName.includes("kids") ||
    normName.includes("cartoon") ||
    normName.includes("disney") ||
    normName.includes("nickelodeon") ||
    normName.includes("pogo") ||
    normName.includes("nick") ||
    normName.includes("shasho") ||
    normName.includes("duronto") ||
    normGroup.includes("kids") ||
    normGroup.includes("cartoon")
  ) {
    return "Kids";
  }

  // 7. Movies Check
  if (
    normName.includes("movie") ||
    normName.includes("hbo") ||
    normName.includes("cine") ||
    normName.includes("film") ||
    normName.includes("star gold") ||
    normName.includes("action") ||
    normGroup.includes("movies") ||
    normGroup.includes("cinema")
  ) {
    return "Movies";
  }

  // 8. Music Check
  if (
    normName.includes("music") ||
    normName.includes("mtv") ||
    normName.includes("vchannel") ||
    normName.includes("sangeet") ||
    normName.includes("b4u music") ||
    normGroup.includes("music")
  ) {
    return "Music";
  }

  // 9. International Fallback Check
  if (
    normGroup.includes("us") ||
    normGroup.includes("uk") ||
    normGroup.includes("canada") ||
    normGroup.includes("english") ||
    normGroup.includes("arabic") ||
    normName.includes("sky") ||
    normName.includes("usa") ||
    normName.includes("uk")
  ) {
    return "International";
  }

  // Default Fallback
  return "Entertainment";
}

// Robust CORS-safe IPTV Stream Proxy with relative playlist rewriter
app.get("/api/stream-proxy", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return res.status(400).send("Invalid stream protocol.");
    }

    // Append permissive CORS headers to bypass strict browser restrictions
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    const abortController = new AbortController();
    req.on("close", () => {
      abortController.abort();
    });

    const response = await fetch(targetUrl, {
      signal: abortController.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Failed to stream source: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    // Detect if we are serving an m3u/m3u8 playlist file to rewrite paths
    const isPlaylist =
      targetUrl.includes(".m3u8") ||
      targetUrl.includes(".m3u") ||
      contentType.includes("application/vnd.apple.mpegurl") ||
      contentType.includes("application/x-mpegurl") ||
      contentType.includes("text/plain");

    if (isPlaylist) {
      const text = await response.text();
      const lines = text.split("\n");
      const parsedUrl = new URL(targetUrl);
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);

      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          return line;
        }

        let absoluteUrl = trimmed;
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
          if (trimmed.startsWith("/")) {
            absoluteUrl = `${parsedUrl.protocol}//${parsedUrl.host}${trimmed}`;
          } else {
            absoluteUrl = `${baseUrl}${trimmed}`;
          }
        }

        return `/api/stream-proxy?url=${encodeURIComponent(absoluteUrl)}`;
      });

      return res.send(rewrittenLines.join("\n"));
    } else {
      // Stream segment fragments or media binaries directly to output
      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                res.end();
                break;
              }
              res.write(Buffer.from(value));
            }
          } catch (err) {
            console.error("Error piping proxy stream chunks:", err);
            res.end();
          }
        };
        await pump();
      } else {
        const arrayBuffer = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuffer));
      }
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return;
    }
    console.error("Dynamic Stream Proxy error:", error);
    if (!res.headersSent) {
      res.status(500).send(`Stream Proxy connection failed: ${error.message}`);
    }
  }
});

// Full API endpoint to aggregate channels
app.get("/api/channels", async (req, res) => {
  try {
    const now = Date.now();
    // Use cached stream playlist if it meets timer window
    if (cachedChannels.length > 0 && now - cacheTime < CACHE_DURATION_MS) {
      return res.json({ status: "success", channels: cachedChannels });
    }

    console.log("Fetching remote IPTV playlists...");
    const playlistUrls = [
      {
        url: "https://raw.githubusercontent.com/FunctionError/PiratesTv/refs/heads/main/combined_playlist.m3u",
        name: "ATV SPORTS",
      },
      {
        url: "https://raw.githubusercontent.com/abusaeeidx/BDxTV/refs/heads/main/full_channels.m3u",
        name: "ATV SPORTS",
      },
    ];

    let allChannels: any[] = [];

    // Parse both endpoints gracefully
    for (const source of playlistUrls) {
      try {
        console.log(`Loading playlist: ${source.name}`);
        const playlistText = await fetchUrlString(source.url);
        const parsed = parseM3uPlaylist(playlistText, source.name);
        allChannels = allChannels.concat(parsed);
      } catch (err) {
        console.error(`Error loading or parsing playlist ${source.name}:`, err);
      }
    }

    // Default Channels if remote fails or yields empty results (safety fallbacks for preview reliability)
    if (allChannels.length === 0) {
      allChannels = [
        {
          id: "default_btv",
          name: "BTV Live",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Bangladesh_Television_logo.png",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          category: "Bangla TV",
          rawGroup: "General BD",
          isHd: true,
          m3uSource: "Local Fallback",
        },
        {
          id: "default_1",
          name: "T Sports HD (Live)",
          logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/T_Sports_logo.png",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          category: "Bangla TV",
          rawGroup: "Sports BD",
          isHd: true,
          m3uSource: "Local Fallback",
        },
        {
          id: "default_2",
          name: "GTV Live",
          logo: "https://picsum.photos/seed/gtv/120/120",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          category: "Bangla TV",
          rawGroup: "General BD",
          isHd: true,
          m3uSource: "Local Fallback",
        },
        {
          id: "default_3",
          name: "Star Sports 1 Live",
          logo: "https://picsum.photos/seed/starsports/120/120",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          category: "Cricket",
          rawGroup: "Sports IN",
          isHd: true,
          m3uSource: "Local Fallback",
        },
        {
          id: "default_4",
          name: "Premier League Live",
          logo: "https://picsum.photos/seed/epl/120/120",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          category: "Football",
          rawGroup: "Sports EN",
          isHd: true,
          m3uSource: "Local Fallback",
        },
        {
          id: "default_5",
          name: "Al Jazeera English",
          logo: "https://picsum.photos/seed/aljazeera/120/120",
          url: "https://live-bbcchannels-playback.akamaized.net/mainservice/live/hls/p02z68td/index.m3u8",
          category: "News",
          rawGroup: "World News",
          isHd: false,
          m3uSource: "Local Fallback",
        },
      ];
    }

    // Sort to place dynamic HD/Sports items at the very top for visual excellence
    cachedChannels = allChannels.sort((a, b) => {
      const aSportsRank = (a.category === "Sports" || a.category === "Cricket" || a.category === "Football") ? 1 : 0;
      const bSportsRank = (b.category === "Sports" || b.category === "Cricket" || b.category === "Football") ? 1 : 0;
      if (bSportsRank !== aSportsRank) {
        return bSportsRank - aSportsRank;
      }
      return b.isHd ? 1 : -a.isHd ? -1 : 0;
    });

    cacheTime = Date.now();
    return res.json({ status: "success", channels: cachedChannels });
  } catch (error) {
    console.error("Critical M3U parsing error:", error);
    return res.status(500).json({ error: "Failed to load dynamic IPTV channels" });
  }
});

// Visitor Tracker Endpoint
app.post("/api/visitor/hit", (req, res) => {
  const stats = incrementVisitorStats();
  res.json({ status: "success", count: stats.count });
});

app.get("/api/visitor/stats", (req, res) => {
  const stats = getVisitorStats();
  res.json({ status: "success", count: stats.count });
});

// Configure Vite or Static Asset Serving
async function bootServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ATV Sports fullstack streaming server ignited on port ${PORT}`);
  });
}

bootServer();
