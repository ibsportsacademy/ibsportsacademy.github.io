const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // You'll need to `npm install node-fetch`

const API_KEY = process.env.IB_YOUTUBE_API_KEY; // Get from environment variable
const CHANNEL_ID = 'UC1lF5cBHpVq2RgCCUMHExig'; // Your channel ID
const VIDEOS_PER_PAGE = 12; // How many videos you want per static page

if (!API_KEY) {
    console.error('IB_YOUTUBE_API_KEY environment variable not set.');
    process.exit(1);
}

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATIC_DATA_DIR = path.join(__dirname, '..', 'static', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(STATIC_DATA_DIR)) {
    fs.mkdirSync(STATIC_DATA_DIR, { recursive: true });
}

async function fetchYoutubeVideos(pageToken = '', maxResults = 50) { // Max 50 per API call
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet,id&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
    }
    return response.json();
}

async function generateStaticData() {
    let allVideos = [];
    let pageToken = null;
    let totalVideosFetched = 0;
    const maxAPICalls = 5; // Limit API calls to avoid over-fetching/quota issues (e.g., 5 * 50 = 250 videos)
    let apiCallCount = 0;

    console.log('Starting YouTube data fetch...');

    try {
        do {
            const data = await fetchYoutubeVideos(pageToken);
            const videos = data.items.filter(item => item.id.kind === 'youtube#video');
            allVideos = allVideos.concat(videos);
            pageToken = data.nextPageToken;
            totalVideosFetched += videos.length;
            apiCallCount++;

            console.log(`Fetched ${videos.length} videos. Total: ${totalVideosFetched}. Next page token: ${pageToken || 'None'}`);

            if (apiCallCount >= maxAPICalls) {
                console.warn(`Reached maximum API call limit (${maxAPICalls}). Stopping fetch.`);
                break;
            }

        } while (pageToken);

        console.log(`Finished fetching. Total videos collected: ${allVideos.length}`);

        // Paginate and save
        let pageNum = 1;
        for (let i = 0; i < allVideos.length; i += VIDEOS_PER_PAGE) {
            const pageVideos = allVideos.slice(i, i + VIDEOS_PER_PAGE);
            const fileName = path.join(DATA_DIR, `youtube_videos_page_${pageNum}.json`);
            const fileNameStatic = path.join(STATIC_DATA_DIR, `youtube_videos_page_${pageNum}.json`);
            fs.writeFileSync(fileName, JSON.stringify(pageVideos, null, 2));
            console.log(`Saved ${pageVideos.length} videos to ${fileName}`);
            fs.writeFileSync(fileNameStatic, JSON.stringify(pageVideos, null, 2));
            console.log(`Saved ${pageVideos.length} videos to ${fileNameStatic}`);
            pageNum++;
        }

        // Create an index file that stores total pages
        const indexFile = path.join(DATA_DIR, 'youtube_index.json');
        fs.writeFileSync(indexFile, JSON.stringify({ totalPages: pageNum - 1, videosPerPage: VIDEOS_PER_PAGE }, null, 2));
        console.log(`Saved index file: ${indexFile} with ${pageNum - 1} pages.`);
        const indexFileStatic = path.join(STATIC_DATA_DIR, 'youtube_index.json');
        fs.writeFileSync(indexFileStatic, JSON.stringify({ totalPages: pageNum - 1, videosPerPage: VIDEOS_PER_PAGE }, null, 2));
        console.log(`Saved index file: ${indexFileStatic} with ${pageNum - 1} pages.`);


    } catch (error) {
        console.error('Error during data generation:', error);
        process.exit(1); // Exit with an error code to fail the GH Action
    }
}

generateStaticData();