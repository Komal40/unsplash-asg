import React, { useEffect, useRef, useState } from 'react'
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
    const canvaRef=useRef(null)

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
         fabric.Image.fromURL(imageUrl, (img, isError) => {
            if (!img) {
                console.error("Image load failed.");
               
            }
            if (img.getElement() === undefined) {
                console.log('Failed to load image!');
                // return;
              }
            if (isError) {
                console.log('Something Wrong with loading image');
                // return;
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
    

      // Add text to the canvas
//   const addText = () => {
//     if (!canvas) return;

//     const text = new fabric.Textbox("Your Caption Here", {
//       left: 100,
//       top: 100,
//       fontSize: 20,
//       fill: "#000",
//     });

//     canvas.add(text);
//   };

//   // Add shapes to the canvas
//   const addShape = (shape) => {
//     if (!canvas) return;

//     let shapeObject;
//     if (shape === "rectangle") {
//       shapeObject = new fabric.Rect({
//         left: 150,
//         top: 150,
//         fill: "blue",
//         width: 100,
//         height: 100,
//       });
//     } else if (shape === "circle") {
//       shapeObject = new fabric.Circle({
//         left: 200,
//         top: 200,
//         fill: "red",
//         radius: 50,
//       });
//     } else if (shape === "triangle") {
//       shapeObject = new fabric.Triangle({
//         left: 250,
//         top: 250,
//         fill: "green",
//         width: 100,
//         height: 100,
//       });
//     }

//     canvas.add(shapeObject);
//   };

//   // Download the canvas as an image
//   const downloadImage = () => {
//     if (!canvas) return;

//     const dataURL = canvas.toDataURL({
//       format: "png",
//     });

//     const link = document.createElement("a");
//     link.href = dataURL;
//     link.download = "modified-image.png";
//     link.click();
//   };


// Initialize the canvas with the selected image

 // Function to initialize the canvas and load the image
 const initializeCanvass = (imageUrl) => {
    // Dispose of existing canvas instance if it exists
    if (canvas) {
        canvas.dispose();
    }

    // Check if the canvas reference is available
    if (canvaRef.current) {
        console.log("imageurl",imageUrl)
        // Create a new Canvas instance
        const canvasInstance = new fabric.Canvas(canvaRef.current, {
            width: 600,
            height: 400,
        });
        canvasInstance.backgroundColor = 'red';
        canvasInstance.renderAll();

        console.log("New canvas instance", canvasInstance);

        // Load the image onto the canvas
        console.log('Loading image...');
        
            fabric.Image.fromURL(imageUrl, (img) => {
                if (!img) {
                    console.log('No image loaded');
                    return; // Exit if no image is loaded
                }
    
                img.scaleToWidth(600); // Scale image to fit canvas width
                img.scaleToHeight(400); 
                canvasInstance.add(img); // Add image to the canvas
                // canvasInstance.sendToBack(img); // Send image to back layer
                canvasInstance.centerObject(img); // Center the image on the canvas
                canvasInstance.setActiveObject(img); // Set the loaded image as active
    
                console.log('Image loaded...');
                // Ensure the canvas re-renders
                canvasInstance.renderAll();
            }, {
                crossOrigin: 'anonymous', // Handle cross-origin images
            });
        
        

        setCanvas(canvasInstance); // Store the new canvas instance in state

        console.log('Canvas initialized',canvasInstance);
        
        return () => { 
            if (canvasInstance) {
                canvasInstance.dispose(); // Cleanup on unmount or when initializing again
            }
        };
    }
};


  // Handle adding captions
  const addCaption = () => {
    if (canvas) {
      const text = new Textbox(caption, {
        left: 50,
        top: 50,
        fontSize: 30,
        fill: 'white',
      });
      canvas.add(text);
      setCaption('');
    }
  };

  // Handle adding shapes (Circle, Rectangle, etc.)
  const addShape = (shape) => {
    let newShape;
    switch (shape) {
      case 'circle':
        newShape = new Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: 'red',
        });
        break;
      case 'rectangle':
        newShape = new Rect({
          left: 150,
          top: 150,
          width: 100,
          height: 50,
          fill: 'blue',
        });
        break;
      case 'triangle':
        newShape = new Triangle({
          left: 200,
          top: 200,
          width: 100,
          height: 100,
          fill: 'green',
        });
        break;
      default:
        return;
    }
    canvas.add(newShape);
  };

  // Handle downloading the modified image
  const downloadImage = () => {
    if (canvas) {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'modified_image.png';
      link.click();
    }
  };



  useEffect(()=>{
    console.log("object",canvaRef.current)
    if(canvaRef.current){
        const initCanva=new Canvas(canvaRef.current,{
            width:500,
            height:500
        })
        initCanva.backgroundColor='green'
        initCanva.renderAll()

        setCanvas(initCanva)
        console.log('useeffect', initCanva)
        return()=>{initCanva.dispose()}

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
  
  return (
    <div>
      <div className='main_container'>
        <input 
        placeholder='Search for Image'
        value={query}
        onChange={(e)=>setQuery(e.target.value)}
        />
       
        <button onClick={handleSearchImage}>Search</button>

      </div>


      {/* Display Search Results */}
      <div className="image_results">
        {result.map((image) => (
          <div key={image.id} className="image_container">
            <img src={image.urls.regular} alt={image.alt_description} />
            <button 
            onClick={() => initializeCanvass(image.urls.regular)}
            >
              Add Captions
            </button>
          </div>
        ))}
      </div>


      {/* Canvas Area */}
      <div className="canvas_area" id="canvas-container">
        <canvas id="canvas" ref={canvaRef}></canvas>
        <div className="canvas_controls">
          <button 
          onClick={addCaption}
          >Add Caption</button>
          <button 
          onClick={() => addShape("rectangle")}
        // onClick={addRectangle}
          >Add Rectangle</button>
          <button 
          onClick={() => addShape("circle")}
          >Add Circle</button>
          <button 
          onClick={() => addShape("triangle")}
          >Add Triangle</button>
          <button 
          onClick={downloadImage}
          >Download</button>
        </div>
        
      </div>
    </div>
  )
}


export default SearchComponent;