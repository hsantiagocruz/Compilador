var option = "1";
var mundo;

window.onload = function() {
    var mouse = false;
    if(document.getElementById("radio1").checked==false)
        option=2;
    var canvas = document.getElementById("canvas1");
    mundo = [];
    var deleteCell = "0";
    var sizeCuadro = {ancho: 25, alto: 25};
    var color = "FF00FF";
    var inputColor = "0000FF";

    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.font = "20px Comic Sans MS";
        if (ctx) {
            function dibujaGrid(disX, disY, anchoLinea, color){
                ctx.strokeStyle = color;
                ctx.lineWidth = anchoLinea;
                var columnas = [];
                var filas = [];
                for (i = 0; i <= canvas.width; i += disX) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
                    ctx.stroke();
                }
                for (i = 0; i <= canvas.height; i += disY) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(ctx.canvas.width, i);
                    ctx.stroke();
                }
                for (x = 0; x < canvas.height; x += disY) {
                    for (y = 0; y < canvas.width; y += disX) {
                        mundo.push([x, y, 0, 0]);
                    }
                }
            }

            function fillCell(x, y, c, typeC, zumCount) {
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
                //dibujaGrid(sizeCuadro.ancho, sizeCuadro.alto, 0.4, "#44414B");
            }
            function typeCell(e){
                var canvaspos = canvas.getBoundingClientRect();
                if(deleteCell=="1"){
                    fillCell( e.clientY - canvaspos.top, e.clientX - canvaspos.left, "#FFFFFF",0,0);
                }
                else{
                    if(option=="1"){
                        fillCell( e.clientY - canvaspos.top,e.clientX - canvaspos.left,"#ff0000",1,0);
                    }
                    else{
                        fillCell( e.clientY - canvaspos.top, e.clientX - canvaspos.left,"#00ff00",2,1);
                    } 
                }
               
            }
            canvas.onmousemove = function(e) {
                if(mouse){
                    typeCell(e);
                }
            };

            canvas.onmousedown = function(e) {
                var event = e
                var btnCode;
                if('object'=== typeof event){
                    btnCode = e.button;
                    switch (btnCode) {
                    case 0:
                        mouse = true;
                        typeCell(e);
                        break;
                    case 2:
                        mouse = true;
                        deleteCell="1";
                        typeCell(e);
                        break;
                    }
                }
            };

            canvas.onmouseup = function() {
                deleteCell="0";
                mouse = false;
            };
            dibujaGrid(sizeCuadro.ancho, sizeCuadro.alto, 0.5, "#44414B");
        } else {
            alert("No se pudo cargar el contexto");
        }
    }
};
function OnChangeRadio (radio) {
    option=radio.value;
}
function diseñar(){
    var content=document.getElementById("opcionesControl");
    content.innerHTML= "<input id='radio_m' name='op' value='1' "+ 
        "onclick='OnChangeRadio (this)' type='radio'  checked='checked'><label for='radio_m'> "+
        "Muro</label><input id='radio_z' name='op' value='2' onclick='OnChangeRadio (this)' "+ 
        " type='radio'><label for='radio_z'>Zumbador</label>";
}
function downloadWorld(){
    var content=document.getElementById("opcionesControl");
    content.innerHTML="<button class='btn btn-outline-dark' onclick='diseñar()'><i class='fa fa-paint-brush'></i> Diseñar</button>";
}
$(function(){
    $('#guardar').click(function(e){
        e.preventDefault();
        var data = {};
        data.nombre=$("#nombre").val();
        if(data.nombre=="")
            data.nombre="Mundo sin nombre";
        //var t0 = performance.now();
        data.mundo=mundo.toString();
        //var t1 = performance.now();
        //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: window.location + "/mundo",						
            success: function(data) {
                console.log('success');
                console.log(data);
                console.log(JSON.stringify(data));
            }
        });
    });				
    $('#tarea').click(function(e){
        e.preventDefault();
        var data = {};
        data.title = "Enviar tarea";
        data.messages = $("#messages").val();
        data.code = $('#code').val();
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: window.location + "/tarea",						
            success: function(data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
        /*$.ajax('http://localhost:3000/endpoint', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function() { console.log('success');},
                error  : function() { console.log('error');}
        });*/
    });				
});