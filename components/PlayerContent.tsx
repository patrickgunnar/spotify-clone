'use client'

import { Song } from "@/types"
import MediaItem from "./MediaItem"
import LikeButton from "./LikeButton"
import { BsPauseFill, BsPlayFill } from "react-icons/bs"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai"
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2"
import Slider from "./Slider"
import usePlayer from "@/hooks/usePlayer"
import { useEffect, useState } from "react"
import useSound from "use-sound"


interface PlayerContentProps {
    song: Song
    songUrl: string
}

// player content
const PlayerContent: React.FC<PlayerContentProps> = ({
    song, songUrl
}) => {
    // player hook
    const player = usePlayer()
    // volume state
    const [volume, setVolume] = useState(1)
    // is playing state
    const [isPlaying, setIsPlaying] = useState(false)

    // play/pause icon 
    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    // volume icon
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

    // to play the next song handler
    const onPlayNext = () => {
        // if not exists an array of songs
        if(player.ids.length === 0) return

        // get current index of songs array
        const currentIndex = player.ids.findIndex((id) => id === player.activeId)
        // define the next song to play
        const nextSong = player.ids[currentIndex + 1]

        // if there's no next song in the array
        // return the first song in the array
        if(!nextSong) return player.setId(player.ids[0])

        // set next song
        player.setId(nextSong)
    }

    // to play the previous song handler
    const onPlayPrevious = () => {
        // if not exists an array of songs
        if(player.ids.length === 0) return

        // get current index of songs array
        const currentIndex = player.ids.findIndex((id) => id === player.activeId)
        // define the next song to play
        const previousSong = player.ids[currentIndex - 1]

        // if there's no previous song in the array
        // return the first song in the array
        if(!previousSong) return player.setId(player.ids[player.ids.length - 1])

        // set previous song
        player.setId(previousSong)
    }

    // playing sound hook
    // passing song url
    // extracts the sound handler, pause handler and play handler
    // volume to the volume state
    // onplay to set isPlaying state
    // onend to set isPlaying state and call onPlayNext
    // onpause to set isPlaying state
    // format to set an array with mp3 value - to play song
    const [play, { pause, sound }] = useSound(songUrl, {
        volume: volume,
        onplay: () => setIsPlaying(true),
        onend: () => {
            setIsPlaying(false)
            onPlayNext()
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3']
    })

    // automatic play the song
    useEffect(() => {
        // play sound
        sound?.play()

        // unload sound
        return () => {
            sound?.unload()
        }
    }, [sound])

    // play song handler
    const handlePlayPause = () => {
        // if not playing the song
        if(!isPlaying) play()
        // if playing, pause the song
        else pause()
    }

    // toggle mute
    const toggleMute = () => {
        // if volume is 0 - set volume state to 1
        if(volume === 0) setVolume(1)
        // if volume is 1 - set volume state to 0
        else setVolume(0)
    }

    // render components
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>
            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
                    onClick={handlePlayPause}
                >
                    <Icon className="text-black"
                        size={30}
                    />
                </div>
            </div>
            <div className="hidden h-full md:flex justify-center items-center w-full max-x-[722px] gap-x-6">
                <AiFillStepBackward className="text-neutral-400 cursor-pointer hover:text-white transition"
                    size={30} onClick={onPlayPrevious}
                />
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
                    onClick={handlePlayPause}
                >
                    <Icon className="text-black"
                        size={30}
                    />
                </div>
                <AiFillStepForward className="text-neutral-400 cursor-pointer hover:text-white transition"
                    size={30} onClick={onPlayNext}
                />
            </div>
            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon className="cursor-pointer"
                        size={34}
                        onClick={toggleMute}
                    />
                    <Slider value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>
        </div>
    );
}
 
export default PlayerContent;
