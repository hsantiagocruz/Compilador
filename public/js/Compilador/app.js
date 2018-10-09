var option = "1";
var editMundo=true;
var ctx;
var errorCodigo=false;
var confirmEjecucion=false;
window.onload = function() {
    var mouse = false;
    rad1=document.getElementById("radio1").checked;
    rad2=document.getElementById("radio2").checked;
    rad3=document.getElementById("radio3").checked;
    if(rad1==true)
        option=1;
    else{
        if(rad2==true)
            option=2;
        else
            option=3;
    }
    var canvas = document.getElementById("canvas1");
    var deleteCell = "0";

    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        ctx.font = "20px Comic Sans MS";
        if (ctx) {
            canvas.onmousemove = function(e) {
                if(editMundo){
                    if(mouse){
                        typeCell(e,deleteCell);
                    }
                }
            };

            canvas.onmousedown = function(e) {
                var event = e
                var btnCode;
                if(editMundo){
                    if('object'=== typeof event){
                        btnCode = e.button;
                        switch (btnCode) {
                        case 0:
                            mouse = true;
                            typeCell(e,deleteCell);
                            break;
                        case 2:
                            mouse = true;
                            deleteCell="1";
                            typeCell(e,deleteCell);
                            break;
                        }
                    }
                }
            };

            canvas.onmouseup = function() {
                if(editMundo){
                    deleteCell="0";
                    mouse = false;
                }
            };
            dibujaGrid(sizeCuadro.ancho, sizeCuadro.alto, 0.5, "#44414B");
        } else {
            alert("No se pudo cargar el contexto");
        }
    }
    //Compilación del lenguaje 
    compilarLenguaje();
    $('#mochila').html(0);
};
function OnChangeRadio (radio) {
    option=radio.value;
}
function cambiarMundo(){
    verMundo();
}
$(function(){
   
    $('#back').click(function(e){
        editMundo=true;
        e.preventDefault();
        $('#download').show();
        $('#desing').show();
        $('#back').hide();
        var content=document.getElementById("opcionesControl");
        content.innerHTML="";
    });
    $('#desing').click(function(e){
        editMundo=true;
        e.preventDefault();
        $('#download').hide();
        $('#back').show();
        var content=document.getElementById("opcionesControl");
        content.innerHTML= "<center><table><tbody><tr><td style='width:90px; text-align:center;'>"+
            " <input id='radio1' name='op' value='1' onclick='OnChangeRadio (this)' checked='checked'"+
            " type='radio'><label for='radio1'>Muro</label></td><td style='width:100px; text-align:center;'>"+
            " <input id='radio2' name='op' value='2' onclick='OnChangeRadio (this)' type='radio'>"+
            "<label for='radio2'>Zumbador</label></td><td style='width:90px; text-align:center;'>"+
            " <input id='radio3' name='op' value='3' onclick='OnChangeRadio (this)' type='radio'>"+
            "<label for='radio2'>Robot</label></td></tr></tbody></table></center>";;
            
    });
    $('#download').click(function(e){
        editMundo=false;
        e.preventDefault();
        $('#desing').hide();
        $('#back').show();
        var content=document.getElementById("opcionesControl");
        content.innerHTML="<select id='listmundos' onchange=cambiarMundo()></select>";
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "mundos/getMundos",						
            success: function(data) {
                if(data.error==false){
                    dataMundos=data.msg;
                    var newOption = $('<option/>').html("Seleccion un mundo");
                    $('#listmundos').append(newOption)
                    for(var i=0;i<data.msg.length;i++){
                        var newOption = $('<option/>');
                        newOption.html(data.msg[i].nombre);
                        newOption.attr('value', data.msg[i].idmundo);
                        $('#listmundos').append(newOption);
                    }
                }
            }
        });
        //verMundo();
    });
    $('#guardar').click(function(e){
        e.preventDefault();
        var data = {};
        data.nombre=$("#nombre").val();
        if(data.nombre==""){
            $("#messageControl").addClass('alert alert-danger').removeClass('messageControl');
            $("#messageControl").html("Es necesario el nombre del mundo para guardarlo.");
        }
        else{
                //var t0 = performance.now();
            data.mundo=mundo.toString();
            //console.log(data.mundo);
            //var t1 = performance.now();
            //console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: window.location + "/mundo",						
                success: function(data) {
                    if(data.error==true){
                        $("#messageControl").addClass('alert alert-danger').removeClass('alert alert-success');
                        $("#messageControl").html("Error: "+data.msg);
                    }
                    else{
                        $("#messageControl").addClass('alert alert-success').removeClass('alert alert-danger');
                        $("#messageControl").html(data.msg);
                    }
                }
            });
        }
        
    });				
    $('#tarea').click(function(e){
        e.preventDefault();
        var data = {};
        data.messages = $("#messages").val();
        data.code = $('#codigo').val();
        //data=JSON.stringify(data);
        //console.log(data);
        if(confirmEjecucion==false){
            $("#messageControl").addClass('alert alert-danger');
            $("#messageControl").html("Primero compila y ejecuta el programa.");
        }
        else{
            data.mundo = mundo.toString();
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: window.location + "/tarea",						
                success: function(data) {
                    if(data.error==true){
                        $("#messageControl").addClass('alert alert-danger').removeClass('alert alert-success');
                        $("#messageControl").html("Error: "+data.msg);
                    }
                    else{
                        $("#messageControl").addClass('alert alert-success').removeClass('alert alert-danger');
                        $("#messageControl").html("Tarea guardada en el servidor.");
                    }
                }
            });
        }
    });		
    $(document).delegate('#codigo', 'keydown', function(e) {
        var keyCode = e.keyCode || e.which;
      
        if (keyCode == 9) {
          e.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
      
          // set textarea value to: text before caret + tab + text after caret
          $(this).val($(this).val().substring(0, start)
                      + "\t"
                      + $(this).val().substring(end));
      
          // put caret at right position again
          this.selectionStart =
          this.selectionEnd = start + 1;
        }
    });
    $('#retraso_mas').click(function(e){
        e.preventDefault();
        r=parseInt($('#retraso').val());
        $('#retraso').html(r+100);
    });
    $('#retraso_menos').click(function(e){
        e.preventDefault();
        r=parseInt($('#retraso').val());
        if(r-100>=-0)
            $('#retraso').html(r-100);
    });
    $('#Compilar').click(function(e){
        e.preventDefault();
        msg=compilarCodigo();
        $('#messages').html("Mensajes:");
        if(msg!="\nCompilación exitosa.")
            errorCodigo=true;
        $('#messages').append(msg);
        //confirmEjecucion=true;
        
    });
    $('#CompilarEjecutar').click(function(e){
        editMundo=false;
        e.preventDefault();
        $('#messages').html("Mensajes:");
        respaldar();
        fillWorld();
        msg=compilarCodigo();
        if(msg=="\nCompilación exitosa."){
            punteroMotor(motorTokens.length-1);
        }
        else{
            
            errorCodigo=true;
        }
        $('#messages').append(msg);
        confirmEjecucion=true;
        //console.log(motorTokens);

    });
});
function respaldar(){
    if(xyRobotBackup !=null && mundoBackup !=null){
        xyRobot=JSON.parse(JSON.stringify(xyRobotBackup));
        mundo=JSON.parse(JSON.stringify(mundoBackup));
    }
    else{
        xyRobotBackup=JSON.parse(JSON.stringify(xyRobot));
        mundoBackup=JSON.parse(JSON.stringify(mundo));
    }
}