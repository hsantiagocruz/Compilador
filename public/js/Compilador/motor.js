async function punteroMotor(indIns,params=[]){
    params=params.map(Number);
    if(params.length>0){
        console.log("params")
        varName=motorTokens[indIns][2].value;
        for( i=0;i<motorTokens[indIns].length;i++){
            //console.log([motorTokens[indIns][2].value,varName])
            if(motorTokens[indIns][i].value==varName)
                motorTokens[indIns][i].value=params[0];
            console.log([motorTokens[indIns][i].value])    
        }

    }
    //punteroBloque(indIns, 3);
    err=await punteroBloque(indIns, 3);
    
    if(err<0)
        return err;
    else
        $('#messages').append("\nEjecución exitosa.");
}

async function punteroBloque(indx, ix){
	let indIns=indx;
	let ins=ix;
    while(motorTokens[indIns][ins].value != "}"){
        await sleep(parseInt($('#retraso').val()));
        //console.log(motorTokens[indIns][ins].value,motorTokens[indIns][ins].ind_);
        //console.log("robot:",xyRobot);
        //let indPunteros=[];
        if(isNaN(motorTokens[indIns][ins].value)==true)
		if(PALABRAS_RESERVADAS.indexOf(motorTokens[indIns][ins].value)==-1 && 
			FUNCIONES_BOOLEANAS.indexOf(motorTokens[indIns][ins].value) ==-1 && 
			terminales.indexOf(motorTokens[indIns][ins].value)==-1){
				for(j=0;j<motorTokens.length;j++){
					if(motorTokens[j][0].value==motorTokens[indIns][ins].value){
                        if(motorTokens[indIns][ins+2].value==")"){
                            err=await punteroMotor(j,[]);
                            if(err<0)
                                return err;
                        }
                        else{
                            err=await punteroMotor(j,[motorTokens[indIns][ins+2].value]);
                            if(err<0)
                                return err;
                        }
                    }
                }
        }
        if(motorTokens[indIns][ins].value=="(" || motorTokens[indIns][ins].value==")" || 
            motorTokens[indIns][ins+1].value=="{" || motorTokens[indIns][ins].value=="}"){
                ins++;
                continue;
            }
        switch(motorTokens[indIns][ins].value){
            case "retornar":{
                ins= motorTokens[indIns].length-1;
                break;
            }
            case "iterar":{
                iBackup=ins; 
                incPunteroBackup=[];
                let llave=0
                switch(motorTokens[indIns][ins+2].value){
                    case "sucesor":{
                        ins++;
                        for(let incPuntero=0;incPuntero<motorTokens[indIns][ins+2].value+1;incPuntero++){
                            llave=await punteroBloque(indIns,ins+4);
                            if(llave<0)
                                return llave;
                        }
                        break;
                    }
                    case "predecesor":{
                        ins++;
                        for(let incPuntero=0;incPuntero<motorTokens[indIns][ins+2].value-1;incPuntero++){
                            llave=await punteroBloque(indIns,ins+4);
                            if(llave<0)
                                return llave;
                        }
                        break;
                    }
                    default:{
                        for(let incPuntero=0;incPuntero<motorTokens[indIns][ins+2].value;incPuntero++){
                            llave=await punteroBloque(indIns,ins+4);
                            if(llave<0)
                                return llave;
                        }
                        break;
                    }
                }
                ins=llave;
                break;
            }
            case "mientras":{
                let iBackup=ins;
                let mientrasBool=true;
                while(mientrasBool==true){
                    ins=iBackup;
                    tem=evalExpresion();
                    mientrasBool=tem[1];
                    ins=tem[0];
                    if(mientrasBool==true)
                        await punteroBloque(indIns,ins);
                    else
                        while(motorTokens[indIns][ins].value!="}"){ins++;}
                }
                break;
            }
            case "si":{
                tem=evalExpresion(indIns,ins);
                mientrasBool=tem[1];
                console.log("Evaluacion",mientrasBool);
                ins=tem[0];
                if(mientrasBool==true){
                    ins=await punteroBloque(indIns,ins);
                    if(motorTokens[indIns][ins+1].value=="sino"){
                        ins++;
                        while(motorTokens[indIns][ins].value!="}"){ins++;}
                    }
                }
                else{
                    while(motorTokens[indIns][ins].value!="}"){ins++;}
                }
                break;
            }
            case "apagar":{
                $('#messages').append("\nEjecución terminada.");
                return -1;
            }
            default:{
                console.log(motorTokens[indIns][ins].value);
                error=instMundo(motorTokens[indIns][ins]);
                if(error<0){
                    $('#messages').append('\nError al ejecutar "' + motorTokens[indIns][ins].value +
                         '", línea: ' + (motorTokens[indIns][ins].ind_+1));
                    $('#messages').append("\nEjecución interrumpida.");
                    return -2;
                }
                break;
            }
        }
        ins++;  
    }
    return ins;
}


function instMundo(inst){
    switch(inst.value){
        case "mover":{
            tem=elFrenteEsClaro();
            if(tem[0]==true){
                moverRobot();
            }
            else
                return -1;
            break;
        }
        case "girarALaIzquierda":{
            if(xyRobot.sentido==1)
                xyRobot.sentido=4;
            else
                xyRobot.sentido--;
            //console.log("girar",xyRobot);
            robot(xyRobot.x, xyRobot.y);
            break;
        }
        case "recogeZumbador":{
            cuadro=mundo[xyRobot.i][xyRobot.j];
            if(cuadro[3]>0 && cuadro[2]==2){
                cuadro[3]=cuadro[3]-1;
                if(cuadro[3]==0)
                    cuadro[2]=3;
                mundo[xyRobot.i][xyRobot.j]=cuadro;
                xyRobot.mochila++;
                robot(xyRobot.x, xyRobot.y);
                $('#mochila').html(xyRobot.mochila);
            }
            else{
                return -1;
            }
            break;
        }
        case "ponZumbador":{
            if(xyRobot.mochila>0){
                xyRobot.mochila--;
                cuadro=mundo[xyRobot.i][xyRobot.j];
                if(cuadro[3]==0 || cuadro[2]==4){
                    cuadro[2]=2;
                    cuadro[3]=0;
                }
                if(cuadro[3]<99){
                    cuadro[3]++;
                    mundo[xyRobot.i][xyRobot.j]=cuadro;
                    robot(xyRobot.x, xyRobot.y);
                    $('#mochila').html(xyRobot.mochila);
                }
                else{
                    return -1;
                }
            }
            else{
                return -1;
            }
            break;
        }
    }
    return 0;
}

function moverRobot(){
    cuadro=mundo[xyRobot.i][xyRobot.j];
    if(cuadro[2]==0 && cuadro[3]==0){
        cuadro[2]=3;
    }
    if(cuadro[2]==4){
        cuadro[2]=3;
        cuadro[3]=0;
    }
    mundo[xyRobot.i][xyRobot.j]=cuadro;
    if(xyRobot.sentido==1){
        robot(xyRobot.x, xyRobot.y-sizeCuadro.alto);
        xyRobot.i--;
    }
    if(xyRobot.sentido==2){
        robot(xyRobot.x+sizeCuadro.ancho, xyRobot.y);
        xyRobot.j++;
    }
    if(xyRobot.sentido==3){
        robot(xyRobot.x, xyRobot.y+sizeCuadro.alto);
        xyRobot.i++;
    }
    if(xyRobot.sentido==4){
        robot(xyRobot.x-sizeCuadro.ancho, xyRobot.y);
        xyRobot.j--;
    }
    cuadro=mundo[xyRobot.i][xyRobot.j];
    if(cuadro[2]==0 || cuadro[2]==3 ){
        cuadro[2]=4;
        cuadro[3]=xyRobot.sentido;
    }
    mundo[xyRobot.i][xyRobot.j]=cuadro;
}
function sleep(ms) {
    /*var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }*/
    return new Promise(resolve => setTimeout(resolve, ms));
}
function evalExpresion(indIns,ins){
    exBoolean="";
    while(motorTokens[indIns][ins+1].value!="{"){
        ins++;
        switch(motorTokens[indIns][ins].value){
            case "(":{
                exBoolean+=motorTokens[indIns][ins].value;
                break;
            }
            case ")":{
                exBoolean+=motorTokens[indIns][ins].value;
                break;
            }
            case "AND":{
                exBoolean+=" && ";
                break;
            }
            case "OR":{
                exBoolean+=" || ";
                break;
            }
            case "NOT":{
                exBoolean+=" ! ";
                break;
            }
            case "esCero":{
                ins++;
                switch(motorTokens[indIns][ins+2].value){
                    case "sucesor":{
                        ins++;
                        if((motorTokens[indIns][ins].value+1)==0)
                            exBoolean+=true;
                        else
                            exBoolean+=false
                        ins++;
                        break;
                    }
                    case "predecesor":{
                        ins++;
                        if((motorTokens[indIns][ins].value-1)==0)
                            exBoolean+=true;
                        else
                            exBoolean+=false
                        ins++;
                        break;
                    }
                    default:{
                        if((motorTokens[indIns][ins].value)==0)
                            exBoolean+=true;
                        else
                            exBoolean+=false
                        break;
                    }
                }
                ins++;
                break;
            }
            default:{
                exBoolean+=motorBoolean(motorTokens[indIns][ins]);
                //exBoolean+="-"
                break;
            }
        }
    }
    console.log(exBoolean);
    return [ins,eval(exBoolean)];
}
function motorBoolean(motorToken){
    switch(motorToken.name){
        case "elFrenteEsClaro":{
            tem=elFrenteEsClaro();
            return tem[0];
        }
        case "elFrenteEstaBloqueado":{
            tem=elFrenteEsClaro();
            return !tem[0];
        }
        case "laIzquierdaEsClara":{
            return laIzquierdaEsClara();
        }
        case "laIzquierdaEstaBloqueda":{
            return !laIzquierdaEsClara();
        }
        case "laDerechaEsClara":{
            return laDerechaEsClara();
        }
        case "laDerechaEstaBloqueda":{
            return !laDerechaEsClara();
        }
        case "enFrenteDeUnZumbador":{
            tem=elFrenteEsClaro();
            return tem[1];
        }
        case "noEnFrenteDeUnZumbador":{
            tem=elFrenteEsClaro();
            return !tem[1];
        }
        case "algunZumbadorEnLaMochila":{
            return algunZumbadorEnLaMochila();
        }
        case "sinZumbadorEnLaMochila":{
            return !algunZumbadorEnLaMochila();
        }
        case "viendoAlNorte":{
            return viendoAlNorte();
        }
        case "viendoAlSur":{
            return viendoAlSur();
        }
        case "viendoAlEste":{
            return viendoAlOeste();
        }
        case "viendoAlOeste":{
            return viendoAlOeste();
        }
        case "noViendoAlNorte":{
            return !viendoAlNorte();
        }
        case "noViendoAlSur":{
            return !viendoAlSur();
        }
        case "noViendoAlEste":{
            return !viendoAlOeste();
        }
        case "noViendoAlOeste":{
            return viendoAlOeste();
        }
    }
}
function viendoAlOeste(){
    if(xyRobot.sentido==4)
        return true;
    return false;
}
function viendoAlEste(){
    if(xyRobot.sentido==2)
        return true;
    return false;
}
function viendoAlSur(){
    if(xyRobot.sentido==3)
        return true;
    return false;
}
function viendoAlNorte(){
    if(xyRobot.sentido==1)
        return true;
    return false;
}
function algunZumbadorEnLaMochila(){
    if(xyRobot.mochila>0)
        return true;
    return false;
}
function laDerechaEsClara(){
    switch(xyRobot.sentido){
        case 1:{
            if(xyRobot.j<25){
                if(mundo[xyRobot.i][xyRobot.j+1][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
        case 2:{
            if(xyRobot.i<12){
                if(mundo[xyRobot.i+1][xyRobot.j][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
        case 3:{
            if(xyRobot.j>0){
                if(mundo[xyRobot.i][xyRobot.j-1][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
        case 4:{
            if(xyRobot.i>0){
                if(mundo[xyRobot.i-1][xyRobot.j][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
    }
    return resultEval;
}
function laIzquierdaEsClara(){
    switch(xyRobot.sentido){
        case 1:{
            if(xyRobot.j>0){
                if(mundo[xyRobot.i][xyRobot.j-1][2]!=1)
                    return true;
                return false;
            }
            return false;
            break;
        }
        case 2:{
            if(xyRobot.i>0){
                if(mundo[xyRobot.i-1][xyRobot.j][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
        case 3:{
            if(xyRobot.j<25){
                if(mundo[xyRobot.i][xyRobot.j+1][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
        case 4:{
            if(xyRobot.i<12){
                if(mundo[xyRobot.i+1][xyRobot.j][2]!=1)
                    return true;
                return false;
            }
            return false;
        }
    }
    return resultEval;
}
function elFrenteEsClaro(){
    resultEval=false;
    zum=false;
    switch(xyRobot.sentido){
        case 1:{
            if(xyRobot.i>0){
                if(mundo[xyRobot.i-1][xyRobot.j][2]!=1){
                    resultEval=true;
                    if(mundo[xyRobot.i-1][xyRobot.j][2]==2)
                        zum=true;
                }
                else
                    resultEval=false;
            }
            else
                resultEval=false;
            break;
        }
        case 2:{
            if(xyRobot.j<25){
                if(mundo[xyRobot.i][xyRobot.j+1][2]!=1){
                    resultEval=true;
                    if(mundo[xyRobot.i][xyRobot.j+1][2]==2)
                        zum=true;
                }
                else
                    resultEval=false;
            }
            else
                resultEval=false;
            break;
        }
        case 3:{
            if(xyRobot.i<12){
                if(mundo[xyRobot.i+1][xyRobot.j][2]!=1){
                    resultEval=true;
                    if(mundo[xyRobot.i+1][xyRobot.j][2]==2)
                        zum=true;
                }
                else
                    resultEval=false;
            }
            else
                resultEval=false;
            break;
        }
        case 4:{
            if(xyRobot.j>0){
                if(mundo[xyRobot.i][xyRobot.j-1][2]!=1){
                    resultEval=true;
                    if(mundo[xyRobot.i][xyRobot.j-1][2]==2)
                        zum=true;
                }
                else
                    resultEval=false;
            }
            else
                resultEval=false;
            break;
        }
    }
    return [resultEval,zum];
}