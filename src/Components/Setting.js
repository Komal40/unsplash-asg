import React, { useEffect, useState } from 'react'

function Setting({canvas}) {

    const [selectedObject, setSelectedObject]=useState(null)
    const [width, setWidth]=useState("")
    const [height, setHeight]=useState("")
    const [diameter, setDiameter]=useState("")
    const [color, setColor]=useState("")

    useEffect(()=>{
        if(canvas){
            canvas.on("selection:created", (event)=>{
                handleObjectSelection(event.selected[0])
            })

            canvas.on("selection:updated", (event)=>{
                handleObjectSelection(event.selected[0])
            })

            canvas.on("selection:cleared", ()=>{
                selectedObject(null)
                clearSettings()
            })

            canvas.on("object:modified", (event)=>{
                handleObjectSelection(event.target)
            })

            canvas.on("object:scaling",(event)=>{
                handleObjectSelection(event.target)
            })
        }
    },[canvas])

    const handleObjectSelection=(object)=>{
        if(!object) return;

        setSelectedObject(object)
        if(object.type=='react'){
            setWidth(Math.round(object.width*object.scaleX))
            setHeight(Math.round(object.height*object.scaleY))
            setColor(object.fill)
            setDiameter('')
        }
        else if(object.type=='circle'){
            setDiameter(Math.round(object.radius*2*object.scaleX))
            setColor(object.fill)
            setWidth("")
            setHeight("")
        }
    }

    const clearSettings=()=>{
        setWidth("")
        setHeight("")
        setColor("")
        setDiameter("")
    }

    const handleWidthChange=(e)=>{
        const value=e.target.value.replace(/,/g, "")
        const intValue=parseInt(value, 10)

        setWidth(intValue)

        if(selectedObject && selectedObject.type=='rect' && intValue>=0){
            selectedObject.set({width:intValue/selectedObject.scaleX})
            canvas.renderAll()
        }
    }

    console.log(canvas)

  return (
    <div>
     {
        selectedObject && selectedObject.type=='rect' && (
            <>
            <input fluid label='width' value={width} onChange={handleWidthChange}/>
            </>
        )
     }
    </div>
  )
}

export default Setting;
