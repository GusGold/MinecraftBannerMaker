var app = {};
var notify = {};

var scene, camera, renderer, controls, light;
var banner, flag, stand, standV, standH;
var flag_G, flag_M, stand_M, standV_G, standV_M, standH_G, standH_M;
var flag_T, stand_T;

var flag_R = 0.00025;

var height = 800,
    width = 400;

var animationEnabled = true;

function initWebGL(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(width, height);
    renderer.setClearColor(0xC6C6C6);
    document.getElementById("banner-canvas-wrap-loading").parentNode.removeChild(document.getElementById("banner-canvas-wrap-loading"));
    document.getElementById("banner-canvas-toggleanimate").classList.remove("hidden");
    document.getElementById("banner-canvas-controltext").classList.remove("hidden");
    document.getElementById("banner-canvas-resetcamera").classList.remove("hidden");
    document.getElementById("banner-canvas-wrap").appendChild(renderer.domElement);
    renderer.domElement.classList.add("noselect");

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.minDistance = 25;
    controls.maxDistance = 60;
    controls.zoomSpeed = 0.1;
    controls.addEventListener("change", render);

    stand = new THREE.Object3D();

    standV_G = new THREE.BoxGeometry(2, 42, 2); //top bar of stand
    standH_G = new THREE.BoxGeometry(20, 2, 2); //pole of stand

    stand_MT = THREE.ImageUtils.loadTexture("assets/img/patterns/base.png", {}, function() {
        render();
    });
    stand_MT.magFilter = THREE.NearestFilter;
    stand_MT.minFilter = THREE.NearestFilter;

    stand_M = new THREE.MeshBasicMaterial({map: stand_MT});
    stand_M.needsUpdate = true;

    standH_T = {
        u: easyVector64(2, 20, 20, 2),
        d: easyVector64(22, 20, 20, 2),
        f: easyVector64(2, 18, 20, 2),
        b: easyVector64(24, 18, 20, 2),
        l: easyVector64(0, 18, 2, 2),
        r: easyVector64(22, 18, 2, 2)};

    standH_G.faceVertexUvs[0] = [];
    standH_G.faceVertexUvs[0][0] = [standH_T["r"][0], standH_T["r"][1], standH_T["r"][3]];
    standH_G.faceVertexUvs[0][1] = [standH_T["r"][1], standH_T["r"][2], standH_T["r"][3]];
    standH_G.faceVertexUvs[0][2] = [standH_T["l"][0], standH_T["l"][1], standH_T["l"][3]];
    standH_G.faceVertexUvs[0][3] = [standH_T["l"][1], standH_T["l"][2], standH_T["l"][3]];
    standH_G.faceVertexUvs[0][4] = [standH_T["u"][0], standH_T["u"][1], standH_T["u"][3]];
    standH_G.faceVertexUvs[0][5] = [standH_T["u"][1], standH_T["u"][2], standH_T["u"][3]];
    standH_G.faceVertexUvs[0][6] = [standH_T["d"][0], standH_T["d"][1], standH_T["d"][3]];
    standH_G.faceVertexUvs[0][7] = [standH_T["d"][1], standH_T["d"][2], standH_T["d"][3]];
    standH_G.faceVertexUvs[0][8] = [standH_T["f"][0], standH_T["f"][1], standH_T["f"][3]];
    standH_G.faceVertexUvs[0][9] = [standH_T["f"][1], standH_T["f"][2], standH_T["f"][3]];
    standH_G.faceVertexUvs[0][10] = [standH_T["b"][0], standH_T["b"][1], standH_T["b"][3]];
    standH_G.faceVertexUvs[0][11] = [standH_T["b"][1], standH_T["b"][2], standH_T["b"][3]];

    standV_T = {
        u: easyVector64(46, 62, 2, 2),
        d: easyVector64(48, 62, 2, 2),
        f: easyVector64(46, 22, 2, 40),
        b: easyVector64(48, 22, 2, 40),
        l: easyVector64(44, 22, 2, 40),
        r: easyVector64(50, 22, 2, 40)};

    standV_G.faceVertexUvs[0] = [];
    standV_G.faceVertexUvs[0][0] = [standV_T["r"][0], standV_T["r"][1], standV_T["r"][3]];
    standV_G.faceVertexUvs[0][1] = [standV_T["r"][1], standV_T["r"][2], standV_T["r"][3]];
    standV_G.faceVertexUvs[0][2] = [standV_T["l"][0], standV_T["l"][1], standV_T["l"][3]];
    standV_G.faceVertexUvs[0][3] = [standV_T["l"][1], standV_T["l"][2], standV_T["l"][3]];
    standV_G.faceVertexUvs[0][4] = [standV_T["u"][0], standV_T["u"][1], standV_T["u"][3]];
    standV_G.faceVertexUvs[0][5] = [standV_T["u"][1], standV_T["u"][2], standV_T["u"][3]];
    standV_G.faceVertexUvs[0][6] = [standV_T["d"][0], standV_T["d"][1], standV_T["d"][3]];
    standV_G.faceVertexUvs[0][7] = [standV_T["d"][1], standV_T["d"][2], standV_T["d"][3]];
    standV_G.faceVertexUvs[0][8] = [standV_T["f"][0], standV_T["f"][1], standV_T["f"][3]];
    standV_G.faceVertexUvs[0][9] = [standV_T["f"][1], standV_T["f"][2], standV_T["f"][3]];
    standV_G.faceVertexUvs[0][10] = [standV_T["b"][0], standV_T["b"][1], standV_T["b"][3]];
    standV_G.faceVertexUvs[0][11] = [standV_T["b"][1], standV_T["b"][2], standV_T["b"][3]];

    standV = new THREE.Mesh(standV_G, stand_M);
    standH = new THREE.Mesh(standH_G, stand_M);

    stand.add(standV);
    stand.add(standH);

    flag_G = new THREE.BoxGeometry(20, 40, 1);

    flag_MT = THREE.ImageUtils.loadTexture(app.setFlagTexture(), {}, function() {
        render();
    });
    flag_MT.magFilter = THREE.NearestFilter;
    flag_MT.minFilter = THREE.NearestFilter;

    flag_M = new THREE.MeshBasicMaterial({map: flag_MT});
    flag_M.needsUpdate = true;

    flag_T = {
        u: easyVector64(2, 62, 20, 1),
        d: easyVector64(22, 62, 20, 1),
        f: easyVector64(1, 23, 20, 40),
        b: easyVector64(22, 23, 20, 40),
        l: easyVector64(0, 23, 1, 40),
        r: easyVector64(41, 23, 1, 40)};

    flag_G.faceVertexUvs[0] = [];
    flag_G.faceVertexUvs[0][0] = [flag_T["r"][0], flag_T["r"][1], flag_T["r"][3]];
    flag_G.faceVertexUvs[0][1] = [flag_T["r"][1], flag_T["r"][2], flag_T["r"][3]];
    flag_G.faceVertexUvs[0][2] = [flag_T["l"][0], flag_T["l"][1], flag_T["l"][3]];
    flag_G.faceVertexUvs[0][3] = [flag_T["l"][1], flag_T["l"][2], flag_T["l"][3]];
    flag_G.faceVertexUvs[0][4] = [flag_T["u"][0], flag_T["u"][1], flag_T["u"][3]];
    flag_G.faceVertexUvs[0][5] = [flag_T["u"][1], flag_T["u"][2], flag_T["u"][3]];
    flag_G.faceVertexUvs[0][6] = [flag_T["d"][0], flag_T["d"][1], flag_T["d"][3]];
    flag_G.faceVertexUvs[0][7] = [flag_T["d"][1], flag_T["d"][2], flag_T["d"][3]];
    flag_G.faceVertexUvs[0][8] = [flag_T["f"][0], flag_T["f"][1], flag_T["f"][3]];
    flag_G.faceVertexUvs[0][9] = [flag_T["f"][1], flag_T["f"][2], flag_T["f"][3]];
    flag_G.faceVertexUvs[0][10] = [flag_T["b"][0], flag_T["b"][1], flag_T["b"][3]];
    flag_G.faceVertexUvs[0][11] = [flag_T["b"][1], flag_T["b"][2], flag_T["b"][3]];

    flag_G.applyMatrix(new THREE.Matrix4().makeTranslation(0, -20, 0));

    flag = new THREE.Mesh(flag_G, flag_M);

    banner = new THREE.Object3D();

    banner.add(stand);
    banner.add(flag);

    standV.translateY(-1);
    standH.translateY(21);
    stand.translateZ(-1.5);
    stand.translateY(-1);
    flag.translateY(21);

    scene.add(banner);

    camera.position.z = 50;
    render();
    animate();
    resetCamera();
}

function animate(){
    if(!animationEnabled){
        return;
    }

    requestAnimationFrame(animate);

    if(flag.rotation.x > 0 || flag.rotation.x < -0.05){
        flag_R = -flag_R
    }

    flag.rotation.x += flag_R;
    banner.rotation.y += 0.004;

    render();
}

function render() {
    renderer.render(scene, camera);
}

function easyVector64(x, y, dx, dy){
    x = x/64
    y = y/64
    dx = dx/64
    dy = dy/64
    return [
        new THREE.Vector2(x, y + dy),
        new THREE.Vector2(x, y),
        new THREE.Vector2(x + dx, y),
        new THREE.Vector2(x + dx, y + dy)];
}

function layerFlag(layers){
    var canvas = document.createElement("canvas");
    var base = new Image();
    base.src = layers[0];

    canvas.width = base.width;
    canvas.height = base.height;

    var context  = canvas.getContext("2d");
    context.drawImage(base, 0, 0);

    for(var l = 1; l < layers.length; l++){
        var img = new Image();
        img.src = layers[l];
        context.drawImage(img, 0, 0);
    }

    return canvas.toDataURL();
}

function toColour(i, c){
    var canvas = document.createElement("canvas");
    var img = new Image();
    img.src = "assets/img/patterns/" + patternsData[i]["i"] + ".png";
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    var imageData = context.getImageData(0, 0, img.width, img.height);
    var pixelData = imageData.data;
    for(var i = 0; i < pixelData.length; i += 4){
        var a = pixelData[i];
        pixelData[i] = coloursData[c]["r"];
        pixelData[i + 1] = coloursData[c]["g"];
        pixelData[i + 2] = coloursData[c]["b"];
        pixelData[i + 3] = a;
    }
    imageData.data = pixelData;
    context.clearRect(0, 0, img.width, img.height);
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

function resetCamera(){
    camera.position.setX(0);
    camera.position.setY(0);
    camera.position.setZ(50);
    flag.rotation.x = 0.0;
    banner.rotation.y = 0.0;
    requestAnimationFrame(render);
    controls.update();
}

function toggleAnimation(override){
    if(override !== undefined){
        animationEnabled = (override ? true : false);
    } else {
        animationEnabled = !animationEnabled;
    }

    animate();
}

function initPatternPreview(target){
    var id = target.getAttribute("id").replace("banner-pattern-", "");
    var canvas = document.getElementById("banner-pattern-preview-" + id);
    if(canvas === null){
        setTimeout(function(){
            initPatternPreview(target);
        }, 25);
    } else {
        canvas.width = 20;
        canvas.height = 40;
        var context = canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.oImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var img = new Image();
        img.src = toColour(id, 0)
        context.drawImage(img, -1, -1, 64, 64);
    }
}

app.setFlagTexture = function(){
    var layersToLayer = [];
    for(var l = 0; l < 7; l++){
        if(l >= this.design.length){
            var canvas = document.getElementById("banner-layer-" + l);
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            layersToLayer[l] = toColour(this.design[l][0], this.design[l][1]);
            var canvas = document.getElementById("banner-layer-" + l);
            canvas.width = 20;
            canvas.height = 40;
            var context = canvas.getContext("2d");
            context.webkitImageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.oImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
            var img = new Image();
            img.src = layersToLayer[l];
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, -1, -1, 64, 64);
        }
    }
    texture = layerFlag(layersToLayer);
    if(flag !== undefined){
        flag.material.map.image.src = texture;
        flag.material.needsUpdate = true;
    }
    requestAnimationFrame(render);
    this.texture = texture;
    return texture;
}

app.loadFlagTexture = function(texture){
    if(typeof texture === "object" && texture.length !== undefined && texture.length > 0 && texture.length < 8){
        if(texture[0][0] === "" && coloursData[texture[0][1].toString()] !== undefined){
            for(var l = 1; l < texture.length; l++){
                if(patternsData[texture[l][0]] !== undefined && texture[l][0] !== "" && coloursData[texture[l][1].toString()] !== undefined){

                } else {
                    console.warn("Not a texture");
                    return false;
                }
            }
        } else {
            console.warn("Not a texture");
            return false;    
        }
    } else {
        console.warn("Not a texture");
        return false;
    }

    this.design = texture;
    this.selectPattern(this.design[0][0]);
    this.selectColour(this.design[0][1]);
    this.checkTexture();
    return true;
}

app.changePreviewColour = function(c){
    var canvases = document.getElementById("banner-patterns-preview").children;
    for(var i = 0; i < canvases.length; i++){
        var id = canvases[i].getAttribute("id").replace("banner-pattern-preview-", "");
        var context = canvases[i].getContext("2d");
        var img = new Image();
        img.src = toColour(id, c);
        context.clearRect(0, 0, canvases[i].width, canvases[i].height);
        context.drawImage(img, -1, -1, 64, 64);
    }
}

app.removeLayer = function(target){
    var id = parseInt(target.getAttribute("id").replace("banner-layer-remove-", ""));
    this.design.splice(id, 1);
    if(this.layerSelected >= this.design.length){
        this.selectLayer(this.design.length - 1);
    }
    this.checkTexture();
};

app.selectColour = function(target){
    if(typeof target === "number"){
        var id = target;
        target = document.getElementById("colour-image-" + target);
    } else {
        var id = parseInt(target.getAttribute("id").replace("colour-image-", ""));
    }
    
    if(this.colourSelected === id){
        return;
    }
    if(this.colourSelected !== undefined){
        document.getElementById("colour-image-" + this.colourSelected).classList.remove("selected");
    }
    this.colourSelected = id;
    this.changePreviewColour(id);
    target.classList.add("selected");
    if(this.layerSelected in this.design){
        this.design[this.layerSelected][1] = this.colourSelected;
    } else {
        this.design.push([this.patternSelected, this.colourSelected]);
    }
    this.checkTexture();
}

app.selectPattern = function(target){
    if(typeof target === "string"){
        var id = target;
        target = document.getElementById("banner-pattern-preview-" + target);
    } else {
        var id = target.getAttribute("id").replace("banner-pattern-preview-", "");
    }
    
    if(this.layerSelected === 0 && id !== ""){
        // this.selectPattern(document.getElementById("banner-pattern-preview-"));
        return;
    } else if (this.layerSelected !== 0 && id === ""){
        // this.selectPattern(document.getElementById("banner-pattern-preview-bo"));
        return;
    }
    document.getElementById("banner-pattern-preview-" + this.patternSelected).classList.remove("selected");
    this.patternSelected = id;
    target.classList.add("selected");
    if(this.layerSelected in this.design){
        this.design[this.layerSelected][0] = this.patternSelected;
    } else {
        this.design.push([this.patternSelected, this.colourSelected]);
    }
    this.checkTexture();
}

app.selectLayer = function(target){
    if(typeof target === "number"){
        var id = target;
        var target = document.getElementById("banner-layer-" + target);
    } else {
        var id = parseInt(target.getAttribute("id").replace("banner-layer-", ""));
    }

    if(this.layerSelected === id){
        return;
    }

    if(id > this.design.length){
        id = this.design.length;
        target = document.getElementById("banner-layer-" + id);
    }
    document.getElementById("banner-layer-" + this.layerSelected).classList.remove("selected");
    if(this.layerSelected === 0 && id > 0){
        //disable base
        document.getElementById("banner-pattern-preview-").classList.add("disabled");
        var patterns = document.getElementById("banner-patterns-preview").children;
        for(var i = 1; i < patterns.length; i++){
            patterns[i].classList.remove("disabled");
        }
    } else if(id === 0 && this.layerSelected > 0){
        //enable base
        document.getElementById("banner-pattern-preview-").classList.remove("disabled");
        var patterns = document.getElementById("banner-patterns-preview").children;
        for(var i = 1; i < patterns.length; i++){
            patterns[i].classList.add("disabled");
        }
    }

    if(this.design[id] === undefined || this.design[id].length !== 2){
        if(this.layerSelected === 0){
            this.layerSelected = id;
            this.selectPattern(document.getElementById("banner-pattern-preview-mc"));
        } else {
            this.layerSelected = id;
            this.selectPattern(document.getElementById("banner-pattern-preview-" + this.patternSelected));
        }
        this.selectColour(document.getElementById("colour-image-" + this.colourSelected));
    } else {
        this.layerSelected = id;
        this.selectPattern(document.getElementById("banner-pattern-preview-" + this.design[this.layerSelected][0]));
        this.selectColour(document.getElementById("colour-image-" + this.design[this.layerSelected][1]));
    }
    target.classList.add("selected");
    this.checkTexture();
}

app.checkTexture = function(){ //todo
    // if(this.design !== this.prevDesign){
    //     console.log("Changing design");
    //     this.prevDesign = this.design;
    //     this.setFlagTexture();
    // } else {
    //     console.log("Not changing design");
    // }
    this.setFlagTexture();
    this.showCrafting();
}

app.showCrafting = function(){
    var recipeCanvas = document.createElement("canvas");
    recipeCanvas.width = 64;
    recipeCanvas.height = 64;
    var recipeContext = recipeCanvas.getContext("2d");
    recipeContext.webkitImageSmoothingEnabled = false;
    recipeContext.mozImageSmoothingEnabled = false;
    recipeContext.msImageSmoothingEnabled = false;
    recipeContext.oImageSmoothingEnabled = false;
    recipeContext.imageSmoothingEnabled = false;
    var layerImg = new Image();
    var recipeResult;
    var recipeResultPrev;
    for(var i = 0; i < 7; i++){
        var craftingWindow = document.getElementById("banner-crafting-window-" + i);
        if(this.design[i] !== undefined){
            craftingWindow.classList.remove("hidden");
            layerImg.src = toColour(this.design[i][0], this.design[i][1]);
            recipeContext.drawImage(layerImg, 0, 0);
            recipeResultPrev = recipeResult;
            recipeResult = recipeCanvas.toDataURL();
            var recipe = recipiesData[this.design[i][0]];
            var colour = this.design[i][1].toString();
            for(var j = 0; j < recipe.length; j++){
                if(recipe[j] !== null){
                    for(var k = 0; k < recipe[j].length; k++){
                        if(recipe[j][k] !== null){
                            var ingredientSlot = craftingWindow.querySelector(".banner-crafting-ingredient-" + ((j * 3) + k));
                            var ingredient = recipe[j][k];
                            ingredientR = ingredient.replace(/%b%/g, recipeResultPrev);
                            if(ingredient === ingredientR){
                                ingredient = ingredient.replace(/%w%/g, "assets/img/items/wool_colored_");
                                ingredient = ingredient.replace(/%i%/g, "assets/img/items/");
                                ingredient = ingredient.replace(/%d%/g, "assets/img/colours/dye_powder_");
                                ingredient = ingredient.replace(/%c%/g, coloursData[colour]["n"]);
                                ingredient += ".png";
                                ingredientSlot.classList.remove("banner-crafting-ingredient-result");
                            } else {
                                ingredient = ingredientR
                                ingredientSlot.classList.add("banner-crafting-ingredient-result");
                            }
                            ingredientSlot.style.backgroundImage = "url(\"" + ingredient + "\")";
                        } else {
                            var ingredientSlot = craftingWindow.querySelector(".banner-crafting-ingredient-" + ((j * 3) + k));
                            ingredientSlot.style.backgroundImage = "";
                        }
                    }
                } else {
                    for(var k = 0; k < 3; k++){
                        var ingredientSlot = craftingWindow.querySelector(".banner-crafting-ingredient-" + ((j * 3) + k));
                        ingredientSlot.style.backgroundImage = "";
                        ingredientSlot.classList.remove("banner-crafting-ingredient-result");
                    }
                }
            }
            craftingWindow.querySelector(".banner-crafting-result").style.backgroundImage = "url(\"" + recipeResult + "\")";
        } else {
            for(var j = 0; j < 9; j++){
                var ingredientSlot = craftingWindow.querySelector(".banner-crafting-ingredient-" + j);
                ingredientSlot.style.backgroundImage = "";
                ingredientSlot.classList.remove("banner-crafting-ingredient-result");
            }
            craftingWindow.querySelector(".banner-crafting-result").style.backgroundImage = "";
            craftingWindow.classList.add("hidden");
        }
    }
}

app.saveImage = function(size){
    if(size === undefined || typeof size !== "number"){
        size = 20;
    } else {
        size = size - (size % 20);
    }
    var img = new Image();
    img.src = this.texture;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = 20;
    canvas.height = 40;
    context.drawImage(img, -1, -1);
    img.src = canvas.toDataURL();
    if(size === 20){
        var download = img.src;
    } else {
        var multiplier = size / 20;
        var canvasEnlarged = document.createElement("canvas");
        canvasEnlarged.width = 20 * multiplier;
        canvasEnlarged.height = 40 * multiplier;
        var contextEnlarged = canvasEnlarged.getContext("2d");
        drawPixelated(img, contextEnlarged, multiplier);
        var download = canvasEnlarged.toDataURL();
    }
    
    notify.show("Your image is ready to download. Please click <a href='" + download + "' download='MyBanner-" + size + "px.png'>here!</a>");
}

app.clear = function(clear){
    if(clear === true){
        app.design = [["", 15]];
        app.selectLayer(0);
        app.selectPattern("");
        app.selectColour(15);
        notify.show("Design cleared");
    } else {
        notify.show("Are you sure you want to clear your design? It will be deleted if you continue.<br><button onclick='app.clear(true)'>Yes, clear my design</button><button onclick='notify.hide()'>No thanks</button>", "error");
    }
}

app.load = function(texture){
    if(!texture){
        notify.show("Put your code in the following box to load in a saved design:<br><input type='text' style='width:100%;'><button onclick='app.load(JSON.parse(this.previousElementSibling.value))'>Load in design</button>");
    } else {
        if(app.loadFlagTexture(texture)){
            notify.show("Texture successfully loaded.");
        } else {
            notify.show("Sorry, but that is not a valid texture", "error");
        }
    }
}

app.save = function(){
    notify.show("Use the following code to be able to load up the same design next time:<br><input type='text' value='" + JSON.stringify(this.design) + "' style='width: 100%;' disabled><br>Or you can download a picture of it in the following sizes:<br><button onclick='app.saveImage(20)'>20x40</button><button onclick='app.saveImage(80)'>80x160</button><button onclick='app.saveImage(160)'>160x320</button><button onclick='app.saveImage(320)'>320x640</button><button onclick='app.saveImage(640)'>640x1280</button><button onclick='app.saveImage(1280)'>1280x2560</button><br>Please note that to make the image, it may cause your browser to slow for a brief period while the data is being calculated.");
}

app.share = function(){
    notify.show("<a href='http://minecraft.gusgold.com/banner/maker.php?share=" + JSON.stringify(this.design) + "' target='_blank'>Share this link</a> to show your friends your wonderful design or copy the following url:<br><input type='text' value='http://minecraft.gusgold.com/banner/maker.php?share=" + encodeURI(JSON.stringify(this.design)) + "' style='width: 100%;' disabled><br>");
}

app.init = function(){
    this.design = [["", 15], ["moj", 1]];
    this.colourSelected = 15;
    // this.selectColour(15);
    
    document.getElementById("colour-image-" + this.colourSelected).classList.add("selected");
    this.changePreviewColour(this.colourSelected);
    this.patternSelected = "";
    document.getElementById("banner-pattern-preview-" + this.patternSelected).classList.add("selected");
    this.layerSelected = 1;
    this.selectLayer(0);
    this.showCrafting();

    if(loadTextureOnStart !== undefined){
        this.loadFlagTexture(loadTextureOnStart);
        loadTextureOnStart = undefined;
    }
}

function checkCompatibility(){
    var unsupported = [];
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    if(typeof window.requestAnimationFrame === "undefined"){
        unsupported.push("requestAnimationFrame");
    }

    var canvas = document.createElement("canvas");
    try {
        var context = canvas.getContext("2d");
        if(!window.WebGLRenderingContext){
            unsupported.push("webgl (browser)");
        } else {
            (function(){
                var contextTypes = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
                for(var i = 0; i < contextTypes.length; i++){
                    var canvas = document.createElement("canvas");
                    context = canvas.getContext(contextTypes[i]);
                    if(context){
                        return;
                    }
                }
                unsupported.push("webgl (drivers)");
            })();
        }
    } catch(e){
        unsupported.push("<canvas> element");
    }

    if(unsupported.length > 0){
        notify.show("Your browser doesn't fully support the following features:<br><br>" + unsupported.join(", ") + "<br><br>This means this webpage is unlikely to work properly.<br>Please consider updating your browser, or upgrading to <a href='https://google.com/chrome' target='_blank'>Google Chrome</a>.", "error");
    }
}

notify.init = function(){
    this.elem = document.getElementById("notify");
    this.elem.children[1].addEventListener("click", function(){notify.hide()});
    this.hide();
    document.addEventListener("click", function(event){
        if(notify.visible){
            var hasParent = event.target.parentNode !== document;
            var elem = event.target;
            while (hasParent){
                if(elem === notify.elem){
                    return;
                }
                elem = elem.parentNode;
                if(elem === null){
                    return;
                }
                hasParent = elem.parentNode !== document;
            }
            notify.hide();
        }
    });
}

notify.show = function(message, classString){
    if(!classString){
        classString = "";
    }
    this.elem.children[0].innerHTML = message;
    this.elem.setAttribute("class", classString);
    setTimeout(function(){
        notify.visible = true;
    }, 1)
    // this.visible = true;
}

notify.hide = function(){
    this.elem.setAttribute("class", "hidden");
    this.elem.children[0].innerHTML = "";
    setTimeout(function(){
        notify.visible = false;
    }, 1)
}

function clearLoading(){
    var loader = document.getElementById("loader");
    loader.classList.add("removing");
    setTimeout(function(){
        loader.parentNode.removeChild(loader);
    }, 500);
}

//Thanks to http://phrogz.net/tmp/canvas_image_zoom.html and SO user Phrogz
function drawPixelated(img,context,zoom,x,y){
    if (!zoom) zoom=4; if (!x) x=0; if (!y) y=0;
    if (!img.id) img.id = "__img"+(drawPixelated.lastImageId++);
    var idata = drawPixelated.idataById[img.id];
    if (!idata){
        var ctx = document.createElement('canvas').getContext('2d');
        ctx.width  = img.width;
        ctx.height = img.height;
        ctx.drawImage(img,0,0);
        idata = drawPixelated.idataById[img.id] = ctx.getImageData(0,0,img.width,img.height).data;
    }
    for (var x2=0;x2<img.width;++x2){
        for (var y2=0;y2<img.height;++y2){
            var i=(y2*img.width+x2)*4;
            var r=idata[i  ];
            var g=idata[i+1];
            var b=idata[i+2];
            var a=idata[i+3];
            context.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
            context.fillRect(x+x2*zoom, y+y2*zoom, zoom, zoom);
        }
    }
};
drawPixelated.idataById={};
drawPixelated.lastImageId=0;

function init(){
    clearLoading();
    checkCompatibility();
    app.init();
    initWebGL();
}