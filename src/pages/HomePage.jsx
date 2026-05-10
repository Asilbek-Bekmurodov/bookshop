import { useState } from 'react'
import VideoIntro from '../components/VideoIntro/VideoIntro'
import Hero from '../components/Hero/Hero'
import NewArrivals from '../components/NewArrivals/NewArrivals'
import BlogCards from '../components/BlogCards/BlogCards'
import AudioSection from '../components/AudioSection/AudioSection'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer'

const HomePage = () => {
  const [currentAudio, setCurrentAudio] = useState(null)
  const [playlist, setPlaylist] = useState([])

  const handlePlay = (item, itemPlaylist) => {
    setCurrentAudio(item)
    setPlaylist(itemPlaylist)
  }

  const handleSelectTrack = (item) => {
    setCurrentAudio(item)
  }

  const handleClose = () => {
    setCurrentAudio(null)
    setPlaylist([])
  }

  return (
    <div>
      <VideoIntro />
      <Hero />
      <NewArrivals />
      <AudioSection onPlay={handlePlay} />
      <BlogCards />
      {currentAudio && (
        <AudioPlayer
          current={currentAudio}
          playlist={playlist}
          onClose={handleClose}
          onSelectTrack={handleSelectTrack}
        />
      )}
    </div>
  )
}

export default HomePage
