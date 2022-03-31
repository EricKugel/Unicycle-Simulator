var canvas;
var ctx;

var progressComplete;
var progressNotComplete;

var cache;

const FPS = 12;

var keys = {
    "K_UP": false,
    "K_DOWN": false,
    "K_LEFT": false,
    "K_RIGHT": false,
    "K_SPACE": false
}

var mouseDown = false;
var touchDown = false;
var lastClicks = [[0, 0]]

var levels;

var shop = [
    {"name":"wig","price":10,"rect":[32,61,79,66],"bought":false},
    {"name":"nose","price":20,"rect":[126,142,79,66],"bought":false},
    {"name":"speed","price":100,"rect":[397,61,79,66],"bought":false},
    {"name":"jump","price":100,"rect":[492,136,79,66],"bought":false},
    {"name":"parachute","price":200,"rect":[36,266,79,66],"bought":false},
    {"name":"level 6","price":300,"rect":[402,261,198,166],"bought":false}
]

const COIN_FONT = "15px Arial";
const FAIL_FONT = "75px Arial";
const COMPLETE_FONT = "50px Arial";

var coins = 0;
var level = 0;
var checkpoint;
var levelImage;
var cyclist;
var multiplier = 1;
var tick = 0;

const STATE_PLAY = 1;
const STATE_FAIL = 2;
const STATE_COMPLETE_LEVEL = 3;
const STATE_START_LEVEL = 4;
const STATE_SHOP = 5;
const STATE_RETURN_TO_CHECKPOINT = 6;
const STATE_LEVEL_SELECT = 7;
const STATE_LOGO = 8;
const STATE_GAME_OVER = 10;
var state = STATE_LOGO;

function setState(newState) {
    state = newState;
    tick = 0;
}

function collectCoin(coinRect) {
    coins += 1;
    levelImage.removeCoin(coinRect);
}

function buy(item) {
    if (!item["bought"]) {
        if (coins >= item["price"]) {
            item["bought"] = true;
            coins -= item["price"];
            if (item["name"] == "level 6") {
                levels[5]["locked"] = false;
            }
        } else {
            ctx.font = COIN_FONT;
            ctx.fillText("You don't have enough coins for item " + item.name + "!", 250, 460);
        }
    } else {
        ctx.font = COIN_FONT;
        ctx.fillText("Item " + item.name + " is already bought!", 250, 460);
    }
}

function reset() {
    levelImage = new LevelImage(ctx, level);
    checkpoint = levels[level].checkpoint;
    cyclist = new Cyclist(ctx, levelImage, checkpoint);
    if (shop[2].bought) {
        cyclist.setTopSpeed(25);
    } if (shop[3].bought) {
        cyclist.setInitialJumpSpeed(-48);
    } if (level == 5) {
        cyclist.setLowGravityl
    }
}

function updateLastClicks(e) {
    lastClicks = [];
    var rect = canvas.getBoundingClientRect();
    for (var i = 0; i < e.touches.length; i++) {
        var x = e.touches[i].clientX;
        var y = e.touches[i].clientY;
        lastClicks.push([x - rect.left, y - rect.top]);
    }
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    window.addEventListener("keydown", function(e) {
        if (e.code == "ArrowUp" || e.code == "KeyW") {
            keys.K_UP = true;
        } else if (e.code == "ArrowRight" || e.code == "KeyD") {
            keys.K_RIGHT = true;
        } else if (e.code == "ArrowDown" || e.code == "KeyS") {
            keys.K_DOWN = true;
        } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
            keys.K_LEFT = true;
        } else if (e.code == "Space") {
            keys.K_SPACE = true;
        }
    });

    window.addEventListener("keyup", function(e) {
        if (e.code == "ArrowUp" || e.code == "KeyW") {
            keys.K_UP = false;
        } else if (e.code == "ArrowRight" || e.code == "KeyD") {
            keys.K_RIGHT = false;
        } else if (e.code == "ArrowDown" || e.code == "KeyS") {
            keys.K_DOWN = false;
        } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
            keys.K_LEFT = false;
        } else if (e.code == "Space") {
            keys.K_SPACE = false;
        }
    });

    window.addEventListener("mousedown", function(e) {
        mouseDown = true;
    }); window.addEventListener("mouseup", function(e) {
        mouseDown = false;
    }); window.addEventListener("mousemove", function(e) {
        var rect = canvas.getBoundingClientRect();
        lastClicks = [[e.clientX - rect.left, e.clientY - rect.top]];
    });

    window.addEventListener("touchstart", function(e) {
        e.preventDefault();
        var helpRect = document.getElementById("help").getBoundingClientRect();
        var rect = canvas.getBoundingClientRect();
        touchDown = true;
        for (var i = 0; i < e.touches.length; i++) {
            var x = e.touches[i].clientX;
            var y = e.touches[i].clientY;
            if (x > helpRect.left && y > helpRect.top && x < helpRect.left + helpRect.width && y < helpRect.top + helpRect.height) {
                this.document.getElementById("help").click();
            } else {
                lastClicks.push([x - rect.left, y - rect.top]);
            }
        }
    }, {
        "passive": false
    });

    window.addEventListener("touchend", function(e) {
        e.preventDefault();
        updateLastClicks(e);
        if (lastClicks.length == 0) {
            touchDown = false;
        }
    }, {
        "passive": false
    });

    window.addEventListener("touchcancel", function(e) {
        updateLastClicks(e);
        if (lastClicks.length == 0) {
            touchDown = false;
        }
    });

    window.addEventListener("touchmove", function(e) {
        e.preventDefault();
        touchDown = true;
        updateLastClicks(e);
    }, {
        "passive": false
    });

    document.getElementById("help").onclick = function() {
        console.log("help!")
        document.getElementById("help").click();
    }
    
    loadImages();
}

function loadImages() {
    progressComplete = document.getElementById("progressComplete");
    progressNotComplete = document.getElementById("progressNotComplete");
    
    // using fileChecker.py
    const imageData = [{"name": "background", "src": "images/background.png"}, {"name": "background1", "src": "images/background1.png"}, {"name": "background2", "src": "images/background2.png"}, {"name": "chute", "src": "images/chute.png"}, {"name": "clownshop", "src": "images/clownshop.png"}, {"name": "complete", "src": "images/complete.png"}, {"name": "failed", "src": "images/failed.png"}, {"name": "gameover", "src": "images/gameover.png"}, {"name": "levelselect", "src": "images/levelselect.png"}, {"name": "lock", "src": "images/lock.png"}, {"name": "logo", "src": "images/logo.png"}, {"name": "wig", "src": "images/wig.png"}, {"name": "$", "src": "blockImages/$.png"}, {"name": "b", "src": "blockImages/b.png"}, {"name": "d", "src": "blockImages/d.png"}, {"name": "f", "src": "blockImages/f.png"}, {"name": "g", "src": "blockImages/g.png"}, {"name": "h", "src": "blockImages/h.png"}, {"name": "p", "src": "blockImages/p.png"}, {"name": "q", "src": "blockImages/q.png"}, {"name": "r", "src": "blockImages/r.png"}, {"name": "s", "src": "blockImages/s.png"}, {"name": "t", "src": "blockImages/t.png"}, {"name": "l", "src": "blockImages/l.png"}, {"name": "cyclist0", "src": "spriteImages/cyclist0.png"}, {"name": "cyclist1", "src": "spriteImages/cyclist1.png"}, {"name": "cyclist2", "src": "spriteImages/cyclist2.png"}, {"name": "cyclist3", "src": "spriteImages/cyclist3.png"}];
    ImageManager.load(imageData, function() {
        cache = ImageManager.cache;
        document.body.removeChild(document.getElementById("progress"));
        levels = [
            {"locked":false,"checkpoint":[0,320],"selectRect":[51,107,121,116],"background": "background"},
            {"locked":true,"checkpoint":[0,320],"selectRect":[231,107,121,116],"background": "background1"},
            {"locked":true,"checkpoint":[0,320],"selectRect":[419,107,121,116],"background": "background"},
            {"locked":true,"checkpoint":[0,320],"selectRect":[50,275,121,116],"background": "background"},
            {"locked":true,"checkpoint":[0,320],"selectRect":[232,278,121,116],"background": "background"},
            {"locked":true,"checkpoint":[0,320],"selectRect":[423,282,121,116],"background": "background2"}
        ];
        checkpoint = levels[level].checkpoint;
        levelImage = new LevelImage(ctx, 1);
        cyclist =  new Cyclist(ctx, levelImage, checkpoint);

        if (document.cookie != "") {
            var data = JSON.parse(document.cookie);
            coins = data.coins;
            shop = data.shop;
            levels = data.levels;
        }

        gameLoop();
    }, function(progress) {
        progressComplete.width = (progress / 100) * 640;
        progressNotComplete.width = ((100 - progress) / 100) * 640;
    });
}

function gameLoop() {
    
    ctx.clearRect(0, 0, 640, 480);
    if (state == STATE_FAIL) {
        ctx.drawImage(cache.failed, 0, 0);
        if (tick <= 1000 / FPS) {
            coins -= 10;
            if (coins < 0) {
                coins = 0;
            }
        } else if (tick > 2000) {
            cyclist = new Cyclist(ctx, levelImage, checkpoint);
            if (shop[2].bought) {
                cyclist.setTopSpeed(25);
            } if (shop[3].bought) {
                cyclist.setInitialJumpSpeed(-48);
            } if (level == 5) {
                cyclist.setLowGravity();
            }
            setState(STATE_PLAY);
        }
    } else if (state == STATE_LOGO) {
        ctx.drawImage(cache.logo, 0, 0);
        if (tick > 1500) {
            setState(STATE_LEVEL_SELECT);
        }
    } else if (state == STATE_COMPLETE_LEVEL) {
        if (tick <= 1000 / FPS) {
            if (level == 5) {
                setState(STATE_GAME_OVER);
            } else if (level < 4) {
                levels[level + 1].locked = false;
            }
        }
        ctx.drawImage(cache.complete, 0, 0);
        if (tick > 1500) {
            setState(STATE_LEVEL_SELECT);
        }
    } else if (state == STATE_GAME_OVER) {
        ctx.drawImage(cache.gameover, 0, 0);
        document.cookie = "";
        if (tick > 1500) {
            window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        }
    } else if (state == STATE_PLAY) {
        ctx.drawImage(cache[levels[level].background], 0, 0);
        levelImage.drawLevel(cyclist.x);
        ctx.font = COIN_FONT;
        ctx.fillText("" + coins, 580, 20);

        var isChuting = keys.K_UP && shop[4].bought;
        if (!isChuting && shop[4].bought && touchDown) {
            for (var i = 0; i < lastClicks.length; i++) {
                if (lastClicks[i][0] < 320 && lastClicks[i][1] < 240) {
                    touchDown = true;
                    break;
                }
            }
        }
        var blocks = cyclist.update(isChuting);

        if (cyclist.y >= 400) {
            setState(STATE_FAIL);
        }

        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (block[0] == "s") {
                setState(STATE_FAIL);
            } else if (block[0] == "$") {
                collectCoin(block[1]);
            } else if (block[0] == "f") {
                setState(STATE_COMPLETE_LEVEL);
            } else if (block[0] == "b") {
                checkpoint = [block[1][0] - 40, block[1][1]];
                levelImage.changeBannerRed(block[1]);
            }
        }

        if (shop[1].bought) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(73, cyclist.y + 10, 2, 0, 2 * Math.PI)
        } if (shop[0].bought) {
            ctx.drawImage(cache.wig, 45, cyclist.y - 10);
        }

        if (touchDown) {
            for (var i = 0; i < lastClicks.length; i++) {
                if (lastClicks[i][0] > 320 && lastClicks[i][1] > 240) {
                    cyclist.accelerate(multiplier);
                } else if (lastClicks[i][0] < 320 && lastClicks[i][1] > 240) {
                    cyclist.accelerate(-1 * multiplier);
                } if (lastClicks[i][1] < 240 && !cyclist.isJumping && (!cyclist.isChuting || lastClicks[i][0] > 320)) {
                    cyclist.initJump();
                }
            } 
        } else {
            if (keys.K_LEFT) {
                cyclist.accelerate(-1 * multiplier);
            } if (keys.K_RIGHT) {
                cyclist.accelerate(multiplier);
            } if (keys.K_SPACE && !cyclist.isJumping) {
                cyclist.initJump();
            }
        }
    } else if (state == STATE_SHOP) {
        ctx.drawImage(cache.clownshop, 0, 0);
        ctx.font = COIN_FONT;
        ctx.fillText("" + coins, 287, 50);
        if ((mouseDown || touchDown)) {
            for (var i = 0; i < lastClicks.length; i++) {
                if (lastClicks[i][0] > 14 && lastClicks[i][1] > 433 && lastClicks[i][0] < 14 + 108 && lastClicks[i][1] < 433 + 41) {
                    setState(STATE_LEVEL_SELECT);
                } else {
                    for (var i = 0; i < shop.length; i++) {
                        var item = shop[i];
                        var rect = item.rect;
                        if (lastClicks[i][0] > rect[0] && lastClicks[i][1] > rect[1] && lastClicks[i][0] < rect[0] + rect[2] && lastClicks[i][1] < rect[1] + rect[3]) {
                            buy(item);
                        }
                    }
                }
            }
        }
    } else if (state == STATE_LEVEL_SELECT) {
        if (tick <= 1000 / FPS) {
            document.cookie = JSON.stringify({"coins": coins, "shop": shop, "levels": levels})
        }
        ctx.drawImage(cache.levelselect, 0, 0);
        for (var i = 0; i < 6; i++) {
            var rect = levels[i].selectRect;
            if (levels[i].locked) {
                ctx.drawImage(cache.lock, levels[i].selectRect[0] + 20, levels[i].selectRect[1] + 20);
            } 
            
            if (mouseDown || touchDown) {
                for (var j = 0; j < lastClicks.length; j++) {
                    if (lastClicks[j][0] > rect[0] && lastClicks[j][1] > rect[1] && lastClicks[j][0] < rect[0] + rect[2] && lastClicks[j][1] < rect[1] + rect[3]) {
                        if (levels[i].locked) {
                            ctx.font = COIN_FONT;
                            ctx.fillText("Level " + (i + 1) + " is locked!", 400, 440);
                        } else {
                            level = i;
                            reset();
                            setState(STATE_PLAY);
                        }
                    }
                    
                    rect = [202,419,190,50];
                    if (lastClicks[j][0] > rect[0] && lastClicks[j][1] > rect[1] && lastClicks[j][0] < rect[0] + rect[2] && lastClicks[j][1] < rect[1] + rect[3]) {
                        setState(STATE_SHOP);
                    }
                }
            }
        }
    }

    tick += 1000 / FPS;
    window.setTimeout(function() {
        gameLoop();
    }, 1000 / FPS)
}