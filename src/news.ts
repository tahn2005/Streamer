export type NewsArticle = {
    source: string;
    id: string;
    title: string;
    time: string;
    summary: string;
    img: string;
    url: string;
    timestamp: string; // added to support sorting
    src: string;
  };
  
  // In-memory cache for latest news articles
  let newsCache: NewsArticle[] = [];
  
  /**
   * Fetches finance news from NewsData.io and updates the in-memory cache.
   */
  export async function getNews(): Promise<void> {
    const API_KEY = 'pub_7a972cdc6d0e4032bc266ec5b7d5998b';
    const query = encodeURIComponent("stock market OR wall street OR nasdaq OR s&p OR earnings OR inflation OR federal reserve");
    const url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&q=${query}&category=business&language=en&country=us`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      let freshArticles = extractArticles(data);
  
      // Remove duplicates within freshArticles by source + title
      const uniqueFresh = [];
      const freshSeen = new Set<string>();
      for (const article of freshArticles) {
        const key = `${article.source}||${article.title}`.toLowerCase();
        if (!freshSeen.has(key)) {
          freshSeen.add(key);
          uniqueFresh.push(article);
        }
      }
  
      // Remove duplicates between uniqueFresh and newsCache by source + title
      const cacheSeen = new Set<string>(
        newsCache.map(a => `${a.source}||${a.title}`.toLowerCase())
      );
      const filteredFresh = uniqueFresh.filter(
        article => !cacheSeen.has(`${article.source}||${article.title}`.toLowerCase())
      );
  
      // Merge filtered fresh articles with existing cache
      const merged = [...filteredFresh, ...newsCache];
  
      // Sort by timestamp descending (most recent first)
      merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
      // Cap at 20 articles
      newsCache = merged.slice(0, 20);
    } catch (error) {
      console.error("❌ Error fetching finance news:", error);
    }
  }
  
  
  /**
   * Extracts and formats news article data from the API response.
   */
  function extractArticles(data: any): NewsArticle[] {
    if (!data || !Array.isArray(data.results)) return [];
  
    return data.results.map((article: any): NewsArticle => ({
      source: article.source_name || 'Unknown Source',
      id: article.article_id || '',
      title: article.title || 'Untitled',
      time: timeAgo(article.pubDate) || 'Unknown Time',
      summary: shortenText(article.description || 'No summary available.'),
      img: article.image_url || '',
      url: article.link,
      timestamp: article.pubDate,
      src: article.source_icon
    }));
  }
  
  // Calculates how recent article is
  function timeAgo(utcTimestamp: string): string {
    const now = new Date();
    const articleDate = new Date(utcTimestamp.replace(' ', 'T') + 'Z'); // convert to UTC
  
    const diffMs = now.getTime() - articleDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays >= 1) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours >= 1) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else {
      return diffMinutes <= 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    }
  }
  
  /**
   * Shortens text to the first 20 words, appending "..." if necessary.
   */
  function shortenText(text: string): string {
    const words = text.trim().split(/\s+/);
    return words.length <= 20 ? text : words.slice(0, 20).join(' ') + '...';
  }
  
  /**
   * Returns the current news cache (if needed in other parts of the app).
   */
  export { newsCache };
  