//IMPORTS
import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//VARIAVEIS
let largura_Canvas = 800;
let altura_Canvas = 790; 
let relogio;
let misturador;
let delta;
let loader;
let latencia_minima;
let abajur;
let shortArm;
let longArm;
let support;
let camera;
let isFullOpen;
let currentColor;
let supportJointAnimation;
let acaoSupportJointAnimation;
let isSupportJointAnimationActive;
let abajurJointAnimation;
let acaoAbajurJointAnimation;
let isAbajurJointAnimationActive;
let longArmAnimation;
let acaoLongArmAnimation;
let isLongArmAnimationActive;
let armToAbajurJointAnimation;
let acaoArmToAbajurJointAnimation;
let isArmToAbajurJointAnimationActive;
let shortArmAnimation;
let acaoShortArmAnimation;
let isShortArmAnimationActive;
let apliqueComponents = [];
    //cores
let black = new THREE.Color("black");
let white = new THREE.Color("white");
let gold = new THREE.Color("gold");
let green = new THREE.Color("green");
let blue = new THREE.Color("blue");
let pink = new THREE.Color("pink");
    //materiais
let plasticMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0.3,  
    metalness: 0.2,  
    clearcoat: 0.5, 
    clearcoatRoughness: 0.1, 
});
let glassMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,   
    metalness: 0.1,  
    opacity: 0.5,    
    transparent: true, 
    transmission: 0.9, 
});
let clothMaterial = new THREE.MeshStandardMaterial({  
    roughness: 1,
    metalness: 0,      
    emissive: 0x222222,    
    emissiveIntensity: 0.3,
  });
    //butões
let btnAnimationSuport = document.getElementById("radioBtn_animateSupport");
let btnAnimationAbajur = document.getElementById("radioBtn_animateAbajur");
let btnAnimationLongArm = document.getElementById("radioBtn_animateLongArm");
let btnAnimationShortArm = document.getElementById("radioBtn_animateShortArm");
let btnAnimationArmToAbajurJoint = document.getElementById("radioBtn_animateAbajurJoint");
let btnChangeOpenClose = document.getElementById("btnChangeOpenClose")
let btnChangeColorToBlack = document.getElementById("btnChangeColorToBlack");
let btnChangeColorToWhite = document.getElementById("btnChangeColorToWhite");
let btnChangeColorToGold = document.getElementById("btnChangeColorToGold");
let btnChangeColorToGreen = document.getElementById("btnChangeColorToGreen");
let btnChangeColorToBlue = document.getElementById("btnChangeColorToBlue");
let btnChangeColorToPink = document.getElementById("btnChangeColorToPink");
let btnChangeArmColorToBlack = document.getElementById("btnChangeArmColorToBlack");
let btnChangeArmColorToWhite = document.getElementById("btnChangeArmColorToWhite");
let btnChangeArmColorToGold = document.getElementById("btnChangeArmColorToGold");
let btnSwitchBackgroundColor = document.getElementById("btnSwitchBackgroundColor");
let btnLookDefault = document.getElementById("btnLookDefault");
let btnLookFromBehind = document.getElementById("btnLookFromBehind");
let btnLookAbajur = document.getElementById("btnLookAbajur");
let btnLookSupport = document.getElementById("btnLookSupport");
let btnLookHinge = document.getElementById("btnLookHinge");
let dropdownAbajurMaterial = document.getElementById("dropdownAbajurMaterial");
  //popup
const popup = document.getElementById('popup');
const openPopupBtn = document.getElementById('btnShowHelp');
const closePopupBtn = document.getElementById('closePopupBtn');




//INTERAÇÃO COM O MODELO 3D - RAYCASTER
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();


//CRIAR SCENE
let scene = new THREE.Scene();


//CONFIGURAR O RENDERER
let targetCanvas = document.getElementById("meuCanvas");
let renderer = new THREE.WebGLRenderer({ canvas : targetCanvas});
renderer.setSize(largura_Canvas, altura_Canvas);
renderer.shadowMap.enabled = true;

//CONFIGURAR CAMERA
camera = new THREE.PerspectiveCamera(70, largura_Canvas/altura_Canvas, 0.1, 1000);
camera.lookAt(0,0,0);
camera.position.set(6,4,10);


//ILUMINACAO 
    //luz ambiente
const light = new THREE.AmbientLight( 0xFFFFFF); 
scene.add( light );
    //ponto de luz
const pointLight = new THREE.PointLight( "white", 50 );
pointLight.position.set( 2, 0, 9);
pointLight.castShadow = true;
scene.add( pointLight );



//IMPORTAR MODELO
relogio = new THREE.Clock();
misturador = new THREE.AnimationMixer(scene)
loader = new GLTFLoader();
loader.load(
    "ficheiro gltf/ApliqueArticuladoPecaUnica.gltf",
    function(gltf){
        scene.add(gltf.scene);

        scene.traverse( function(obj){
            if (!obj.isMesh) {
                return                
            }


            obj.castShadow = true;
            obj.receiveShadow = true;

            switch(obj.name) {
                case "AbajurJoint":
                    apliqueComponents.push(obj);
                    break;
                case "Support":
                    apliqueComponents.push(obj);
                    break;
                case "CircleJoint":
                    apliqueComponents.push(obj);
                    break;
                default:
                    break;
              }

        });

        
        abajur = scene.getObjectByName("Abajur");
        shortArm = scene.getObjectByName("ShortArm");
        support = scene.getObjectByName("CircleJoint");
        longArm = scene.getObjectByName("LongArm");


        //Animações
            //Animação Suporte
        supportJointAnimation = THREE.AnimationClip.findByName( gltf.animations, 'SupportJointAnimation' )
        acaoSupportJointAnimation = misturador.clipAction( supportJointAnimation )
        acaoSupportJointAnimation.setLoop(THREE.LoopPingPong);
        misturador.update( relogio.getDelta() )
            //Animação Abajur
        abajurJointAnimation = THREE.AnimationClip.findByName( gltf.animations, 'AbajurJointAnimation' )
        acaoAbajurJointAnimation = misturador.clipAction( abajurJointAnimation )
        acaoAbajurJointAnimation.setLoop(THREE.LoopPingPong);
        misturador.update( relogio.getDelta() )
            //Animação Long Arm
        longArmAnimation = THREE.AnimationClip.findByName( gltf.animations, 'LongArmAnimation' )
        acaoLongArmAnimation = misturador.clipAction( longArmAnimation )
        acaoLongArmAnimation.setLoop(THREE.LoopPingPong);
        misturador.update( relogio.getDelta() )
            //Animação Short Arm
        shortArmAnimation = THREE.AnimationClip.findByName( gltf.animations, 'ShortArmAnimation' )
        acaoShortArmAnimation = misturador.clipAction( shortArmAnimation )
        acaoShortArmAnimation.setLoop(THREE.LoopPingPong);
        misturador.update( relogio.getDelta() )
            //Animação Short Arm
        armToAbajurJointAnimation = THREE.AnimationClip.findByName( gltf.animations, 'ArmToAbajurJointAnimation' )
        acaoArmToAbajurJointAnimation = misturador.clipAction( armToAbajurJointAnimation )
        acaoArmToAbajurJointAnimation.setLoop(THREE.LoopPingPong);
        misturador.update( relogio.getDelta() )
     

        //configurações iniciais
        isFullOpen = true;
        currentColor = white;
        abajur.children[0].material = plasticMaterial;
        isAbajurJointAnimationActive = false;
        isArmToAbajurJointAnimationActive = false;
        isLongArmAnimationActive = false;
        isShortArmAnimationActive = false;
        isSupportJointAnimationActive = false

        
    }


)



//DEFINIR COR DO BACKGROUND
scene.background = new THREE.Color(0xffffff);



//ORBIT CONTROLS
const orbitsControls = new OrbitControls(camera, renderer.domElement) 

    //Limites de zoom
orbitsControls.minDistance = 2;
orbitsControls.maxDistance = 30;
    //Desativar a possibilidade de deslocar o modelo
orbitsControls.enablePan = false;



//RENDERIZAR E ANIMAR 
delta = 0;
latencia_minima = 1/60;

function animar(){
    requestAnimationFrame(animar);

    delta+= relogio.getDelta();

    if(delta < latencia_minima)
        return;

    
    misturador.update(Math.floor(delta / latencia_minima)* latencia_minima)
    renderer.render(scene, camera);
    delta = delta%latencia_minima;

}



animar();





//INTERAÇÃO COM O MODELO 3D

//raycaster
meuCanvas.onclick = function(evento) { 
    let limites = evento.target.getBoundingClientRect();

    mouse.x = + ((evento.clientX - limites.left) / limites.width) * 2 - 1;
    mouse.y = - ((evento.clientY - limites.top)/  limites.height) * 2 + 1;

    getSelectedComponent()
}
function getSelectedComponent() { 
    raycaster.setFromCamera(mouse, camera); 
    let catchedComponentes = raycaster.intersectObjects(apliqueComponents); 

    if (catchedComponentes.length > 0) { 
        switch(catchedComponentes[0].object.name) {
            case "AbajurJoint":
            case "AbajurMesh":

                if(isFullOpen){
                    camera.position.set(1.22,-1.13,8.46);
                    camera.lookAt(0,0,0);
            
                    break;
                }
               
                camera.position.set(1.2,5,4); 
                camera.lookAt(0,0,0); 
                break;

            case "SupportJointHolder": 
            case "CircleJoint":   
            case "Support":
                
                camera.position.set(0.51,0.28, 1.50);
                camera.lookAt(0,0,0); 
                break;

            case "LongArm":
            case "ShortArm":
                
                if(isFullOpen){
                    camera.position.set(0.29,0.18, 5.41);
                    camera.lookAt(0,0,0);
            
                    break
                }
            
                camera.position.set(0.3,4.8,0.5); 
                camera.lookAt(0,0,0); 

                break;
            default:
                break;
          }
    } 
}


//PROGRAMAÇÃO DOS BOTÕES

    //Animações
btnAnimationSuport.onchange = function(){
    if(isSupportJointAnimationActive){
        acaoSupportJointAnimation.stop();
        isSupportJointAnimationActive = false;
    }else{
       
        acaoSupportJointAnimation.play();
        isSupportJointAnimationActive = true;
    }
}
btnAnimationAbajur.onchange = function(){
    if(isAbajurJointAnimationActive){
        acaoAbajurJointAnimation.stop();
        isAbajurJointAnimationActive = false;
    }else{
        acaoAbajurJointAnimation.play();
        isAbajurJointAnimationActive = true;
    }        
}
btnAnimationLongArm.onchange = function(){
    if(isLongArmAnimationActive){
        acaoLongArmAnimation.stop();
        isLongArmAnimationActive = false;
    }else{
        acaoLongArmAnimation.play();
        isLongArmAnimationActive = true;
    }          
}
btnAnimationShortArm.onchange = function(){
    if(isShortArmAnimationActive){
        acaoShortArmAnimation.stop();
        isShortArmAnimationActive = false;
    }else{
        acaoShortArmAnimation.play();
        isShortArmAnimationActive = true;
    }         
}
btnAnimationArmToAbajurJoint.onchange = function(){
    if(isArmToAbajurJointAnimationActive){
        acaoArmToAbajurJointAnimation.stop();
        isArmToAbajurJointAnimationActive = false;
    }else{
        acaoArmToAbajurJointAnimation.play();
        isArmToAbajurJointAnimationActive = true;
    }         
}



    //Posições
btnChangeOpenClose.onclick = function(){
    if(isFullOpen){
        isFullOpen = false;
        longArm.rotation.x = (Math.PI / 2 )*-1;
        shortArm.rotation.x = Math.PI / 2 ;
    }else{
        isFullOpen = true;
        longArm.rotation.x = 0;
        shortArm.rotation.x = 0 ;
    }

    btnLookDefault.checked = true;;
    camera.position.set(6,4,10); 
    camera.lookAt(0,0,0);
}


    //Alterar cores do abajur
btnChangeColorToBlack.onclick = function(){

    abajur.children[0].material.color = black; 
    currentColor = black;
    
}
btnChangeColorToWhite.onclick = function(){

    abajur.children[0].material.color = white; 
    currentColor = white;
    
}
btnChangeColorToGold.onclick = function(){

    abajur.children[0].material.color = gold; 
    currentColor = gold;

}
btnChangeColorToGreen.onclick = function(){

    abajur.children[0].material.color = green; 
    currentColor = green;

}
btnChangeColorToBlue.onclick = function(){

    abajur.children[0].material.color = blue; 
    currentColor = blue;

}
btnChangeColorToPink.onclick = function(){

    abajur.children[0].material.color = pink; 
    currentColor = pink;

}

    //Alterar cor do braço
btnChangeArmColorToBlack.onclick = function(){
    
    shortArm.material.color = black;
    support.material.color = black;  
        
}
btnChangeArmColorToWhite.onclick = function(){
    
    shortArm.material.color = white;
    support.material.color = white; 
        
}
btnChangeArmColorToGold.onclick = function(){
    
    shortArm.material.color = gold;
    support.material.color = gold; 
    
}

    //Alternar cor do Background
btnSwitchBackgroundColor.onclick = function(){
    scene.background == black ? scene.background = white : scene.background = black; 
}

    //Alterar posição da camera
btnLookDefault.onchange = function(){
    camera.position.set(6,4,10); 
    camera.lookAt(0,0,0);
}
btnLookFromBehind.onchange = function(){
    
    if(isFullOpen){
        camera.position.set(2.5,1.8,-2.7);
        camera.lookAt(0,0,0);

        return
    }
   
    camera.position.set(2,-1,-7); 
    camera.lookAt(0,0,0); 
   
}
btnLookAbajur.onchange = function(){
    
    if(isFullOpen){
        camera.position.set(1.22,-1.13,8.46);
        camera.lookAt(0,0,0);

        return
    }
   
    camera.position.set(1.2,5,4); 
    camera.lookAt(0,0,0); 
    
}
btnLookSupport.onchange = function(){
    
    camera.position.set(0.51,0.28, 1.50);
    camera.lookAt(0,0,0); 

}
btnLookHinge.onchange = function(){
    
    if(isFullOpen){
        camera.position.set(0.29,0.18, 5.41);
        camera.lookAt(0,0,0);

        return
    }
   
    camera.position.set(0.3,4.8,0.5); 
    camera.lookAt(0,0,0); 
}

    //Alterar material do abajur
dropdownAbajurMaterial.addEventListener("change", function () {
    const selectedValue = this.value;

    switch (selectedValue) {
        case "tecido":
            clothMaterial.color = currentColor; 
            abajur.children[0].material = clothMaterial;
            break;
        case "plastico":
            plasticMaterial.color = currentColor;
            abajur.children[0].material = plasticMaterial;
            break;
        case "vidro":
            glassMaterial.color = currentColor; 
            abajur.children[0].material = glassMaterial;
            break;
        default:
            break;
    }
});


//Support pop up
openPopupBtn.onclick = function() {
    popup.style.display = 'block';
};

closePopupBtn.onclick = function() {
    popup.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
};
