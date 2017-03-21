<?php
    $patternsJSON = file_get_contents("assets/data/patterns.json");
    $patterns = json_decode($patternsJSON, true);
    $coloursJSON = file_get_contents("assets/data/colours.json");
    $colours = json_decode($coloursJSON, true);
    $recipiesJSON = file_get_contents("assets/data/recipies.json");
    $recipies = json_decode($recipiesJSON, true); 
    $loadOnStart = false;
    if(isset($_GET["share"])){
        $loadOnStart = json_encode($_GET["share"]);
    } ?>
<!DOCTYPE html>
<html>
    <head>
        <title>3D Banner Test</title>
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
        <meta encoding="utf-8" http-equiv="encoding">
        <link rel="stylesheet" type="text/css" href="assets/css/main.css">
        <link rel="stylesheet" type="text/css" href="assets/css/maker.css">
    </head>
    <body onload="init()">
        <div id="loader">
            <div id="loader-message">
                Please be patient while assets are being loaded in...
            </div>
        </div>
        <script type="text/javascript">
            var patternsData = <?=$patternsJSON?>;
            var coloursData = <?=$coloursJSON?>;
            var recipiesData = <?=$recipiesJSON?>;
        </script>
        <script type="text/javascript" src="assets/js/three.min.js"></script>
        <script type="text/javascript" src="assets/js/three.orbitcontrols.js"></script>
        <script type="text/javascript" src="assets/js/banner-canvas.js"></script>
        <header>
            <h2 class="center">Minecraft Banner Designer</h2>
        </header>
        <main class="clear">
            <div id="main-app" class="clear">
                <div id="banner-canvas-wrap">
                    <div id="banner-canvas-wrap-loading">
                        Loading...
                    </div>
                    <div id="banner-canvas-toggleanimate" onclick="toggleAnimation()" class="noselect hidden">
                        toggle animation
                    </div>
                    <div id="banner-canvas-controltext" class="noselect hidden">
                        lmb: rotate, rmb: zoom
                    </div>
                    <div id="banner-canvas-resetcamera" onclick="resetCamera()" class="noselect hidden">
                        reset camera
                    </div>
                </div>
                <div id="right-pane">
                    <div id="banner-patterns-wrap" class="clear">
                        <div id="banner-patterns-instructions" class="clear center">
                            Pick a pattern
                        </div>
                        <div id="banner-patterns-img" onload="initPatternPreview()" class="hidden noselect">
<?php
    foreach($patterns as $pattern => $patternS){ ?>
                            <img src="assets/img/patterns/<?=$patternS["i"]?>.png" id="banner-pattern-<?=$pattern?>" class="hidden" alt="<?=$patternS["d"]?>" onload="initPatternPreview(this)">
<?php
    } ?>
                        </div>
                        <div id="banner-patterns-preview" class="pattern-list noselect">
<?php
    foreach($patterns as $pattern => $patternS){ ?>
                           <canvas id="banner-pattern-preview-<?=$pattern?>" class="pattern-preview noselect <?=($pattern !== "")? "disabled":""?>" onclick="app.selectPattern(this)"></canvas>
<?php
    } ?>
                        </div>
                    </div>
                    <div id="banner-colours-wrap" class="clear">
                        <div id="banner-colours-intructions" class="center">
                            Pick a colour
                        </div>
                        <div id="banner-colours" class="colour-list noselect">
<?php 
    foreach($colours as $colour => $colourS){ ?>
                            <img src="assets/img/colours/dye_powder_<?=$colourS["n"]?>.png" id="colour-image-<?=$colour?>" class="colour" style="background-color: rgba(<?=$colourS["r"]?>, <?=$colourS["g"]?>, <?=$colourS["b"]?>, 0.7);" onclick="app.selectColour(this)">
<?php
    } ?>
                        </div>
                    </div>
                    <div id="banner-layers-wrap" class="clear">
                        <div id="banner-layers-instructions" class="clear center">
                            Pick a layer
                        </div>
<?php
    for($i = 0; $i < 7; $i++){ ?>
                        <div class="banner-layer-wrap">
                            <canvas id="banner-layer-<?=$i?>" class="banner-layer-preview noselect" onclick="app.selectLayer(this)"></canvas>
<?php
        if($i > 0){ ?>
                            <div id="banner-layer-remove-<?=$i?>" class="banner-layer-remove noselect" onclick="app.removeLayer(this)">X&nbsp;</div>
<?php
        } ?>
                        </div>
<?php
    } ?>
                    </div>
                    <div id="banner-share">
                            <button id="banner-share-load" onclick="app.load()">Load</button>
                            <button id="banner-share-save" onclick="app.save()">Save</button>
                            <button id="banner-share-share" onclick="app.share()">Share</button>
                            <button id="banner-share-clear" onclick="app.clear()">Clear</button>
                    </div>
                </div>
            </div>
            <div id="banner-crafting" class="clear">
<?php
    for($i = 0; $i < 7; $i++){ ?>
                <div id="banner-crafting-window-<?=$i?>" class="banner-crafting-window <?=($i > 0)? "hidden":""?> ">
<?php
        for($j = 0; $j < 9; $j++){ ?>
                    <div class="banner-crafting-ingredient banner-crafting-ingredient-<?=$j?>"></div>
<?php
        } ?>
                    <div class="banner-crafting-result"></div>
                </div>
<?php
    } ?>
            </div>
        </main>
        <footer class="center">
            Graphics from <a href="http://minecraft.net">Minecraft</a> by <a href="http://mojang.com" target="_blank">Mojang</a><br>
            Made by <a href="http://gusgold.com">GusGold</a>
        </footer>
        <div id="notify" class="hidden">
            <div id="notify-message"></div>
            <div id="notify-dismiss">X</div>
        </div>
        <script>
            notify.init();
            var loadTextureOnStart = undefined;
            try {
                loadTextureOnStart = <?=($loadOnStart)? "JSON.parse(" . $loadOnStart . ")" : "undefined"?>;
            } catch(e){
                console.warn("Couldn't parse input:");
                console.warn(e);
                notify.show("Couldn't load in the shared design", "error");
            }
        </script>
    </body>
</html>