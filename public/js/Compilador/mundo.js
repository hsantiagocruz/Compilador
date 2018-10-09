var mundo=new Array(13);
var sizeCuadro = {ancho: 25, alto: 25};
var dataMundos=[];
var img = new Image();
var dataMundosTarea=[];
var xyRobot={x:0, y:300, sentido:1, i:12, j:0, mochila:0};
var mundoBackup=null;
var xyRobotBackup=null;
var canvas;
var ctx
//blanco,rojo,verde
var color=["#FFFFFF","#ff0000","#00ff00","#ffff00"];
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

    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
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
    for (var x = 0, i=0; x < canvas.height; x += disY, i++) {
		mundo[i]=[];
        for (var y = 0; y < canvas.width; y += disX) 
            mundo[i].push([x, y, 0, 0]);
    }
    xyRobot.i=12;
    xyRobot.j=0;
    robot(0,300);
}
function robot(x, y){
    cuadro=mundo[xyRobot.i][xyRobot.j];
    //console.log("EL PUTO CUADRO MAN: " + cuadro)
    //console.log("cuadro"+cuadro);
    //if(cuadro[2]==2){
        ctx.fillStyle = color[cuadro[2]];
        ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
        if(cuadro[3]>0 && cuadro[2]==2){
            ctx.fillStyle = "black";
            ctx.fillText(cuadro[3],cuadro[1]+1,cuadro[0]+20);
        }   
    //}
    sentido=xyRobot.sentido;
    xyRobot.x=x;
    xyRobot.y=y;
    if(sentido==1){
        img.src = 'images/flecha.png';
    }   
    if(sentido==2){
        img.src = 'images/flecha2.png';
    }
    if(sentido==3){
        img.src = 'images/flecha3.png';
    }
    if(sentido==4){
        img.src = 'images/flecha4.png';
    }
    img.onload = function(){ctx.drawImage(img, x+1, y+1,25-2,25-2);}
}
function fillCell(x, y, c, typeC, zumCount) {
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = c;
    for (i = 0; i < 13; i++) {
		for(j=0; j<26; j++){
			var cuadro = mundo[i][j];
			if (
				x > cuadro[0] &&
				x < cuadro[0] + sizeCuadro.ancho &&
				y > cuadro[1] &&
				y < cuadro[1] + sizeCuadro.alto
			) {
                if(cuadro[2]==4 && typeC==0)
                    break;
                cuadro[2]=typeC;
                if(typeC==4){
                    ctx.fillStyle = color[cuadro[0]];
                    ctx.fillRect(xyRobot.x+1,xyRobot.y+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
                    xyRobot.i=i;
                    xyRobot.j=j;
                    if(cuadro[3]>=1){
                        if(cuadro[3]==1)
                            cuadro[3]=4;
                        else
                            cuadro[3]--;
                        xyRobot.sentido=cuadro[3];
                    }
                    else{
                        cuadro[3]=1;
                        xyRobot.sentido=1;
                    }
                    robot(cuadro[1],cuadro[0]);
                }
                else{
                    ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
                    if(typeC==0 || typeC==1)
                        cuadro[3]=0;
                    else{
                        if(cuadro[3]<99)
                            cuadro[3]= cuadro[3]+zumCount;
                        if(cuadro[3]>0){
                            ctx.fillStyle = "black";
                            ctx.fillText(cuadro[3],cuadro[1]+1,cuadro[0]+20);
                        }
                    }
                }
				mundo[i][j]=[];
				mundo[i][j]=cuadro;
				break;
			}
        }
        //console.log(mundo);        
    }
}
function fillWorld(){
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    for (i = 0; i < 13; i++) {
		for(j=0; j<26; j++){
			var cuadro = mundo[i][j];
			if(cuadro[2]==1)
				ctx.fillStyle=color[1];
			if(cuadro[2]==2)
				ctx.fillStyle=color[2];
			if(cuadro[2]==3)
				ctx.fillStyle=color[3];
			if(cuadro[2]==0 || cuadro[2]==4)
                ctx.fillStyle=color[0];
            ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
            if(cuadro[2]==4){
                xyRobot.i=i;
                xyRobot.j=j;
                xyRobot.mochila=0;
                xyRobot.sentido=cuadro[3];
                robot(cuadro[1],cuadro[0]);
            }
			if(cuadro[3]>0 && cuadro[2]!=4){
				ctx.fillStyle = "black";
				ctx.fillText(cuadro[3],cuadro[1]+1,cuadro[0]+20);
			}
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
        if(option=="2")
            fillCell( e.clientY - canvaspos.top, e.clientX - canvaspos.left,color[2],2,1);
        if(option=="3")
            fillCell( e.clientY - canvaspos.top, e.clientX - canvaspos.left,color[0],4,1);
    }
}
function verMundo(){
    var canvas = document.getElementById("canvas1");
    var select= document.getElementById('listmundos');
    var valueSel=select.options[select.selectedIndex].value;
    for(i=0;i<dataMundos.length;i++){
        if(dataMundos[i].idmundo==valueSel){
            dibujarMundo(dataMundos[i].codigo);
            break;
        }
    }
}
function dibujarMundo(mundoString){
    smundo=mundoString.split(",").map(Number);
    x=0;
    for (i = 0; i < 13; i ++){
        mundo[i]=[];
        for (j = 0; j < 26; j ++) 				
            mundo[i].push([smundo[x++], smundo[x++], smundo[x++], smundo[x++]]);
    }
    //console.log(mundo);	
    fillWorld();
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
	for (i = 0; i < 13; i ++)
		for (j = 0; j < 26; j ++){
			var cuadro = mundo[i][j];
			ctx.fillRect(cuadro[1]+1,cuadro[0]+1, sizeCuadro.ancho-2, sizeCuadro.alto-2);
    }
}
function verMundoAlumno(id){
    var data={"id":id};
    if(dataMundosTarea.length==0)
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            url: window.location + "/getMundoAlumno",						
            success: function(data) {
                console.log(data);
                if(data.error==false){
                    dataMundosTarea=data.mundo;
                    console.log(data);
                    dibujarMundo(dataMundosTarea[id]);
                    console.log(asdsad123);
                }
                else{
                    console.log("error");
                }
            }
        });
    else{
        dibujarMundo(dataMundosTarea[id]);
    }
}