import React, { useEffect , useRef, useState} from 'react'
import { FabricImage } from 'fabric'
import * as fabric from 'fabric'
import { Canvas } from 'fabric'
import Setting from './Setting'
import Video from './Video'


function Practice() {
    const canvaRef=useRef(null)
    const [canvas, setCanvas]=useState(null)


    useEffect(()=>{
        if(canvaRef.current){
            const initCanvas=new Canvas(canvaRef.current, {
                width:500,
                height:500,
            })
            initCanvas.backgroundColor='green'
            initCanvas.renderAll()

            setCanvas(initCanvas)

            return()=>{
                initCanvas.dispose()
            }
        }
    },[])
   
    const addRectangle=()=>{
        if(canvas){
            const rec=new fabric.Rect({
                top:100,
                left:50,
                width:100,
                height:100,
                fill:'blue'
            })
            canvas.add(rec)
        }
    }

    const canvasref=useRef(null)
    const handleAddImage=(e)=>{
        const canvas=new fabric.Canvas(canvasref.current)
        console.log('new canva',canvas)
        const imgObj=e.target.files[0]
        console.log('selected image',imgObj)
        let reader=new FileReader()
        reader.readAsDataURL(imgObj)
        reader.onload=(e)=>{
            let imageUrl=e.target.result
            let imageElement=document.createElement('img')
            imageElement.src=imageUrl
            imageElement.onload=function(){
                let image=new fabric.Image(imageElement)
                canvas.add(image)
                canvas.centerObject(image)
                canvas.setActiveObject(image)
            }
        }
        console.log('reader', reader)
    }
   
  return (
    <div>
      <h1>Fabric.js on React - fabric.Canvas('...')</h1>
     <canvas id='canvas' 
     ref={canvaRef}
     />
     <button onClick={addRectangle}> Add Rectangle</button>
     <input type='file' accept='image/*' label='Add Image' onChange={handleAddImage}/>
     <canvas width='800' height='400' ref={canvasref}/>
     {/* <Setting canvas={canvas}/>
     <Video canvas={canvas} canvaRef={canvaRef}/> */}
    </div>
  )
}

export default Practice;

