import React, { useRef, useState } from 'react'
import {Image as fabricImage} from 'fabric'

function Video({canvas, canvaRef}) {

    const[videoSrc, setVideoSrc]=useState(null)
    const [fabricVideo, setFabricVideo]=useState(null)
    const [recordingChunk, setRecordingChunk]=useState([])
    const [isRecording, setIsRecording]=useState(false)
    const [loadPercentage, setLoadPercentage]=useState(0)
    const [uploadMessage, setUploadMessage]=useState('')
    const [recordingTime, setRecordingTime]=useState(0)
    const [isPlaying, setIsPlaying]=useState(false)
    const videoRef=useRef(null)
    const fileInputRef=useRef(null)

    
    const handleVideoUpload=(event)=>{
        const file=event.target.files[0]

        if(file){
            setLoadPercentage(0)
            setVideoSrc(null)
            setUploadMessage("")

            const url=URL.createObjectURL(file)
            setVideoSrc(url)

            const videoElement=document.createElement('video')
            videoElement.src=url
            videoElement.crossOrigin="anonymous"

            videoElement.addEventListener("loadeddata", ()=>{
                const videoWidth=videoElement.videoWidth
                const videoHeight=videoElement.videoHeight
                videoElement.width=videoWidth
                videoElement.height=videoHeight

                const canvasWidth=canvas.width
                const canvasHeight=canvas.height

                const scale=Math.min(
                    canvasWidth/videoWidth,
                    canvasHeight/videoHeight
                )

                canvas.renderAll()
                const fabricImage=new fabricImage(videoElement,{
                    left:0,
                    top:0,
                    scaleX:scale,
                    scaleY:scale,
                })
                setFabricVideo(fabricImage)
                canvas.add(fabricImage)
                canvas.renderAll()

                setUploadMessage("uploaded")
                setTimeout(()=>{
                    setUploadMessage("")
                },3000)
            })

            videoElement.addEventListener("progress",()=>{
                if(videoElement.buffered.length>0){
                    const bufferedEnd=videoElement.buffered.end(
                        videoElement.buffered.length=1
                    )
                    const duration=videoElement.duration
                    if(duration>0){
                        setLoadPercentage((bufferedEnd/duration)*100)
                    }
                }
            })

            videoElement.addEventListener("error",(error)=>{
                console.error("video land error", error)
            })
            videoRef.current=videoElement
        }

    }

    const handlePlayPauseVideo=()=>{
        if(videoRef.current){
            if(videoRef.current.paused){
                videoRef.current.play()
                videoRef.current.addEventListener("timeupdate",()=>{
                    fabricVideo.setElement(videoRef.current)
                    canvas.renderAll()
                })
                setIsPlaying(true)
            }else{
                videoRef.current.pause()
                setIsPlaying(false)
            }
        }
    }

    const handleStopVideo=()=>{
        if(videoRef.current){
            videoRef.current.pause()
            videoRef.current.currentTime=0
            setIsPlaying(false)
            canvas.renderAll()
        }
    }

  return (
    <div>
      <input
      ref={fileInputRef}
      type='file'
      style={{display:'none'}}
      accept='video/mp4'
      onChange={handleVideoUpload}
      />
    </div>
  )
}

export default Video
