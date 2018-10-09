var mundo=[];
var sizeCuadro = {ancho: 25, alto: 25};
var dataMundos=[];
var img = new Image();
//blanco,rojo,verde
var color=["#FFFFFF","#ff0000","#00ff00","#"];
window.onload = function() {
    //Esta función solo es para la pagina ../mundos
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: window.location + "/getMundos",						
        success: function(data) {
            if(data.error==false){
                dataMundos=data.msg;
                for(var i=0;i<data.msg.length;i++){
                    var newOption = $('<option/>');
                    newOption.html(data.msg[i].nombre);
                    newOption.attr('value', data.msg[i].idmundo);
                    $('#listmundos').append(newOption);
                }
            }
        }
    });
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    if (canvas && canvas.getContext) {
        if (ctx){
            dibujaGrid(sizeCuadro.ancho, sizeCuadro.alto, 0.5, "#44414B");
        }
            
        else 
            alert("No se pudo cargar el contexto");
    }
};
function dibujaGrid(disX, disY, anchoLinea, color){
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.font = "20px Comic Sans MS";
    ctx.strokeStyle = color;
    ctx.lineWidth = anchoLinea;
    for (var i = 0; i <= canvas.width; i += disX) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (var i = 0; i <= canvas.height; i += disY) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }
    for (var x = 0; x < canvas.height; x += disY) {
        for (var y = 0; y < canvas.width; y += disX) 
            mundo.push([x, y, 0, 0]);
    }
    robot(ctx,1,0,300);
}
function robot(ctx,sentido, x, y){
    if(sentido==1)
        img.src = 'images/flecha.png';
    if(sentido==2)
        img.src = 'images/flecha2.png';
    if(sentido==3)
        img.src = 'images/flecha3.png';
    if(sentido==4)
        img.src = 'images/flecha4.png';
    img.onload = function(){ctx.drawImage(img, x, y,25,25);}
}
function fillCell(x, y, c, typeC, zumCount) {
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = c;
    for (i = 0; i < mundo.length; i++) {
        var cuadro = mundo[i];
        if (
            x > cuadro[0] &&
            x < cuadro[0] + sizeCuadro.ancho &&
            y > cuadro[1] &&
            y < cuadro[1] + sizeCuadro.alto
        ) {
            ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
            cuadro[2]=typeC;
            if(typeC==0 || typeC==1)
                cuadro[3]=0;
            else{
                cuadro[3]= cuadro[3]+zumCount;
                if(cuadro[3]>0){
                    ctx.fillStyle = "black";
                    ctx.fillText(cuadro[3],cuadro[1]+1,cuadro[0]+20);
                }
            }
            mundo[i]=[];
            mundo[i]=cuadro;
            break;
        }
    }
}
function fillWorld(){
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    for(i=0;i<mundo.length;i++){
        var cuadro = mundo[i];
        if(cuadro[2]==1)
            ctx.fillStyle=color[1];
        if(cuadro[2]==2)
            ctx.fillStyle=color[2];
        if(cuadro[2]==3)
            ctx.fillStyle=color[3];
        if(cuadro[2]==0)
            ctx.fillStyle=color[0];
        ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
        if(cuadro[3]>0){
            ctx.fillStyle = "black";
            ctx.fillText(cuadro[3],cuadro[1]+1,cuadro[0]+20);
        }
    }
}
function typeCell(e,deleteCell){
    var canvas = document.getElementById("canvas1");
    var canvaspos = canvas.getBoundingClientRect();
    if(deleteCell=="1")
        fillCell( e.clientY - canvaspos.top, e.clientX - canvaspos.left, color[0],0,0);
    else{
        if(option=="1")
            fillCell( e.clientY - canvaspos.top,e.clientX - canvaspos.left,color[1],1,0);
        else
            fillCell( e.clientY - canvaspos.top, e.clientX - canvaspos.left,color[2],2,1);
    }
}
function verMundo(){
    var canvas = document.getElementById("canvas1");
    var select= document.getElementById('listmundos');
    var valueSel=select.options[select.selectedIndex].value;
    for(i=0;i<dataMundos.length;i++){
        if(dataMundos[i].idmundo==valueSel){
           smundo=dataMundos[i].codigo.split(",").map(Number);
           j=0;
           mundo=[];
           for (x = 0; x < canvas.height; x += sizeCuadro.alto) {
                for (y = 0; y < canvas.width; y += sizeCuadro.ancho) 
                    mundo.push([smundo[j++], smundo[j++], smundo[j++], smundo[j++]]);
            }
            fillWorld();
            break;
        }
    }
}
function eliminarMundo(){
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle=color[0];
    var data={"idmundo":0};
    var select= document.getElementById('listmundos');
    data.idmundo=select.options[select.selectedIndex].value;
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: window.location + "/deleteMundo",						
        success: function(data) {
            if(data.error==false){
                dataMundos=data.msg;
                $('#listmundos').empty();
                for(var i=0;i<data.msg.length;i++){
                    var newOption = $('<option/>');
                    newOption.html(data.msg[i].nombre);
                    newOption.attr('value', data.msg[i].idmundo);
                    $('#listmundos').append(newOption);
                }
            }
        }
    });
    for(i=0;i<mundo.length;i++){
        var cuadro = mundo[i];
        ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
    }

}