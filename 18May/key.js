
    let xnumber=0
    let ynumber=0
    let xaxis = document.getElementById("xaxis")
    let yaxis = document.getElementById("yaxis")

    document.addEventListener("keydown", e=>{
      
        if (e.key==="ArrowUp"){
            xnumber++
            xaxis.innerHTML=xnumber
        }

        if (e.key==="ArrowDown"){
            xnumber--
            xaxis.innerHTML=xnumber
        }
        if (e.key==="ArrowRight"){
            ynumber++
            yaxis.innerHTML=ynumber
            
        }
        if (e.key==="ArrowLeft"){
            ynumber--
            yaxis.innerHTML=ynumber
            
        }
        
    });

    var primitive;

    var options= document.getElementById("options")

    function choosePrimitive(){
        primitive=options.value
        console.log('primitive: ', primitive);
    }

  
   

    
  