import React, { useEffect, useState } from 'react'
import './SearchComponent.css'
import axios from 'axios'
import * as fabric from 'fabric'
import { Canvas, Image, Textbox, Rect, Circle, Triangle } from 'fabric';
// import { fabric } from 'fabric'; // this also installed on your project
import { useFabricJSEditor } from 'fabricjs-react';



function SearchComponent() {
const { selectedObjects, editor, onReady } = useFabricJSEditor();

    const [query, setQuery]=useState('')
    const [result, setResult]=useState([])
    const [canvas, setCanvas]=useState(null)
    const [caption, setCaption] = useState('');
    const accessKey=process.env.REACT_APP_ACCESS_KEY


    const handleSearchImage=async()=>{
        try {
            const res=await axios.get('https://api.unsplash.com/search/photos',{
                headers:{
                    Authorization:`Client-ID ${accessKey}`
                },
                params: {
                    query: query,
                    // per_page: 10,
                  },
            })

            console.log(res)
            setResult(res.data.results)
            
        } catch (error) {
            console.log(error)
        }
    }




    const initializeCanvas = (imageUrl) => {
        console.log('canvas',canvas, imageUrl)
        // Dispose of the existing canvas if it exists
        if (canvas) {
            console.log('Disposing of existing canva')
            canvas.dispose();
        }
    
        const canvasElement = document.getElementById('canvas');
        if (!canvasElement) {
            console.log("Canvas element does not exist in the DOM.");
            return;
        }
        if (canvasElement) {
            console.log("Canvas element exist in the DOM.", canvasElement);
            canvasElement.innerHTML = ""; // Reset the canvas element
        }

        const canvasContainer = document.getElementById("canvas-container");
        if (canvasContainer) {
            canvasContainer.innerHTML = ""; // Clear container contents
    
            // Create a new canvas element
            const newCanvas = document.createElement("canvas");
            newCanvas.id = "canvas";
            canvasContainer.appendChild(newCanvas);
        }
    
        // Create a new canvas instance
        console.log("Creating new fabric canvas...");
        const canvasInstance = new fabric.Canvas("canvas", {
            width: 600,
            height: 400,
            backgroundColor: "#fff",
        });
    
        console.log("Canvas initialized:", canvasInstance);
        // Load the image onto the canvas
         fabric.Image.fromURL(`${imageUrl}`, (img) => {
            if (!img) {
                console.error("Image load failed.");
               
            }
            console.log("Image loaded successfully:", img);
            img.scaleToWidth(600);
            img.set({ left: 0, top: 0 });
            canvasInstance.add(img);
            canvasInstance.sendToBack(img);
            canvasInstance.renderAll(); 
            console.log("Image added to canvas successfully.");
    
            // Set the canvas instance after the image is loaded
            setCanvas(canvasInstance);
            console.log("Image added to canvas successfully.");
        }, {
            crossOrigin: "anonymous" // Handle cross-origin images
        })
    // Additional Debugging Logs
console.log("Fabric version:", fabric.version);
console.log("Canvas instance:", canvasInstance);
console.log("Image URL:", imageUrl);

    console.log("Canvas initialization completed.");

    };
    


  return (
    <div>
      <div className='main_container'>
        <input 
        placeholder='Search for Image'
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        />
        {/* <input 
            type="text" 
            value={imgUrl} 
            onChange={ e => setImgURL(e.target.value)} 
          /> */}
        <button onClick={handleSearchImage}>Search</button>

      </div>


      {/* Display Search Results */}
      <div className="image_results">
        {result.map((image) => (
          <div key={image.id} className="image_container">
            <img src={image.urls.regular} alt={image.alt_description} />
            <button onClick={() => initializeCanvas(image.urls.regular)}>
              Add Captions
            </button>
          </div>
        ))}
      </div>


     
     
    </div>
  )
}


export default SearchComponent;