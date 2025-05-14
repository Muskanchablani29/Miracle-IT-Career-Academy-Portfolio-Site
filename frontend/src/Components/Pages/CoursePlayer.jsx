import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './CoursePlayer.css';

const CoursePlayer = ({ youtubePlaylistId }) => {
  const [videoIds, setVideoIds] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  useEffect(() => {
    if (!youtubePlaylistId) return;

    // Fetch playlist videos using YouTube Data API v3
    const fetchPlaylistVideos = async () => {
      const apiKey = 'AIzaSyC1eVmXqiAw0BHoNf1rnZfghtJPrmdV4wQ'; // Replace with your YouTube API key
      let nextPageToken = '';
      let videos = [];

      try {
        do {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${youtubePlaylistId}&key=${apiKey}&pageToken=${nextPageToken}`
          );
          const data = await response.json();
          const ids = data.items.map(item => item.snippet.resourceId.videoId);
          videos = [...videos, ...ids];
          nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        setVideoIds(videos);
        if (videos.length > 0) {
          setCurrentVideoId(videos[0]);
        }
      } catch (error) {
        console.error('Failed to fetch playlist videos:', error);
      }
    };

    fetchPlaylistVideos();
  }, [youtubePlaylistId]);

  const onVideoSelect = (videoId) => {
    setCurrentVideoId(videoId);
  };

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="course-player-container">
      <div className="playlist">
        <h3>Playlist</h3>
        <ul>
          {videoIds.map((id) => (
            <li
              key={id}
              className={id === currentVideoId ? 'active' : ''}
              onClick={() => onVideoSelect(id)}
            >
              Video {videoIds.indexOf(id) + 1}
            </li>
          ))}
        </ul>
      </div>
      <div className="video-player">
        {currentVideoId ? (
          <YouTube videoId={currentVideoId} opts={opts} />
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
