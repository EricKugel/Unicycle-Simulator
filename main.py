####### UNICYCLE SIMULATOR #######
import pygame, sys
from pygame.locals import *
from level import LevelImage
from sprite import Cyclist

pygame.init()
FPS = 12
FramePerSec = pygame.time.Clock()
SURFACE = pygame.display.set_mode((640,480))
SURFACE.fill(pygame.Color("white"))
pygame.display.set_caption("Unicycle Simulator")

BLUE = pygame.Color(0,0,255)
RED = pygame.Color(255,0,0)
GREEN = pygame.Color(0,255,0)
BLACK = pygame.Color(0,0,0)
WHITE = pygame.Color(255,255,255)

BACKGROUND = pygame.image.load("images/background.png")
BACKGROUND1 = pygame.image.load("images/background1.png")
BACKGROUND2 = pygame.image.load("images/background2.png")
LEVELSELECT = pygame.image.load("images/levelselect.png")
CLOWNSHOP = pygame.image.load("images/clownshop.png")
WIG = pygame.transform.scale(pygame.image.load("images/wig.png"),(40,20))
LOCK = pygame.image.load("images/lock.png")
LOGO = pygame.transform.scale(pygame.image.load("images/logo.png"),(640,480))
FAILED = pygame.transform.scale(pygame.image.load("images/failed.png"),(640,480))
COMPLETE = pygame.transform.scale(pygame.image.load("images/complete.png"),(640,480))
GAMEOVER = pygame.transform.scale(pygame.image.load("images/gameover.png"),(640,480))

SHOP_RECT = pygame.Rect(202,419,190,50)
BACK_RECT = pygame.Rect(14,433, 108,41)
COIN_FONT = pygame.font.SysFont("Arial",15)
FAIL_FONT = pygame.font.SysFont("Arial",75)
COMPLETE_FONT = pygame.font.SysFont("Arial",50)


levels = [
    {"locked":False,"checkpoint":(0,320),"selectRect":pygame.Rect(51,107,121,116),"background":BACKGROUND},
    {"locked":True,"checkpoint":(0,320),"selectRect":pygame.Rect(231,107,121,116),"background":BACKGROUND1},
    {"locked":True,"checkpoint":(0,320),"selectRect":pygame.Rect(419,107,121,116),"background":BACKGROUND},
    {"locked":True,"checkpoint":(0,320),"selectRect":pygame.Rect(50,275,121,116),"background":BACKGROUND},
    {"locked":True,"checkpoint":(0,320),"selectRect":pygame.Rect(232,278,121,116),"background":BACKGROUND},
    {"locked":True,"checkpoint":(0,320),"selectRect":pygame.Rect(423,282,121,116),"background":BACKGROUND2}
]
shop = [
    {"name":"wig","price":10,"rect":pygame.Rect(32,61,79,66),"bought":False},
    {"name":"nose","price":20,"rect":pygame.Rect(126,142,79,66),"bought":False},
    {"name":"speed","price":100,"rect":pygame.Rect(397,61,79,66),"bought":False},
    {"name":"jump","price":100,"rect":pygame.Rect(492,136,79,66),"bought":False},
    {"name":"parachute","price":200,"rect":pygame.Rect(36,266,79,66),"bought":False},
    {"name":"level 6","price":300,"rect":pygame.Rect(402,261,198,166),"bought":False}
]

coins = 0
level = 0
coinText = COIN_FONT.render(str(coins),True, BLACK)
checkpoint = levels[level]["checkpoint"]
levelImage = LevelImage(SURFACE, 1)
cyclist = Cyclist(SURFACE, levelImage, checkpoint)
multiplier = 1

STATE_PLAY = 1
STATE_FAIL = 2
STATE_COMPLETE_LEVEL = 3
STATE_START_LEVEL = 4
STATE_SHOP = 5
STATE_RETURN_TO_CHECKPOINT = 6
STATE_LEVEL_SELECT = 7
STATE_LOGO = 8
STATE_SHOP = 9
STATE_GAME_OVER = 10
state = STATE_LOGO

def setState(newState):
    global state
    state = newState

def collectCoin(coinRect):
    global coins
    coins += 1
    levelImage.removeCoin(coinRect)

def buy(item):
    global coins
    if (not item["bought"]):
        if (coins >= item["price"]):
            item["bought"] = True
            coins -= item["price"]
            if item["name"] == "level 6":
                levels[5]["locked"] = False
        else:
            boughtText = COIN_FONT.render(f"You don't have enough coins for item '{item['name']}'!",BLACK,True)
            SURFACE.blit(boughtText,(250,440))
    else:
        boughtText = COIN_FONT.render(f"Item '{item['name']}' is already bought!",BLACK,True)
        SURFACE.blit(boughtText,(250,440))

def reset():
    global levelImage, checkpoint, cyclist
    levelImage = LevelImage(SURFACE, level)
    checkpoint = levels[level]["checkpoint"]
    cyclist = Cyclist(SURFACE, levelImage, checkpoint)
    if shop[2]["bought"]:
        cyclist.setTopSpeed(25)
    if shop[3]["bought"]:
        cyclist.setInitialJumpSpeed(-48)
    if level == 5:
	    cyclist.setLowGravity()

def unlockAllLevels():
    for i in range(5):
        levels[i]["locked"] = False

### Test Lines ###
# Just uncomment what you want.

# Unlock all levels except 6
# unlockAllLevels()

# Unlock level 6 (normally only possible through purchase)
# levels[5]["locked"] = False

# Get 1000 coins
# coins = 1000

# Purchase wig and nose
# shop[0]["bought"] = True
# shop[1]["bought"] = True

# Purchase increased speed, purchase increased jump power
# shop[2]["bought"] = True
# shop[3]["bought"] = True

# Purchase parachute!
# Yahoo!
# shop[4]["bought"] = True

while True:
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
            sys.exit()
    SURFACE.fill(WHITE)
    
    if state == STATE_FAIL:
        SURFACE.blit(FAILED, (0,0))
        coins -= 10
        if coins < 0:
            coins = 0
        setState(STATE_RETURN_TO_CHECKPOINT)

    #-----------------------------------------------------------------------------

    elif state == STATE_LOGO:
        SURFACE.blit(LOGO,(0,0))
        state = STATE_LEVEL_SELECT
        pygame.display.update()
        pygame.time.wait(1500)

    #-----------------------------------------------------------------------------
        
    elif state == STATE_COMPLETE_LEVEL:
        if level < 4:
            levels[level+1]["locked"] = False
        SURFACE.blit(COMPLETE, (0,0))
        setState(STATE_LEVEL_SELECT)
        if(level == 5):
            setState(STATE_GAME_OVER)
        pygame.display.update()
        pygame.time.wait(1500)

    #-----------------------------------------------------------------------------
        
    elif state == STATE_GAME_OVER:
        SURFACE.blit(GAMEOVER, (0,0))
        pygame.display.update()
        pygame.time.wait(1500)
        pygame.quit()
        sys.exit()

    #-----------------------------------------------------------------------------

    elif state == STATE_PLAY:
        SURFACE.blit(levels[level]["background"], (0,0))
        levelImage.drawLevel(cyclist.x)
        coinText = COIN_FONT.render(str(coins),True, BLACK)
        SURFACE.blit(coinText, (580,5))

        keys = pygame.key.get_pressed()
        isChuting = False
        if keys[pygame.K_UP]: 
            # If parachute is bought, chute
            if shop[4]["bought"]:
                isChuting = True
        
        blocks = cyclist.update(isChuting)

        if(cyclist.y >= 400):
            setState(STATE_FAIL)

        for block in blocks:
            if block[0] == 's':
                setState(STATE_FAIL)
            if block[0] == '$':
                collectCoin(block[1])
            if block[0] == 'f':
                setState(STATE_COMPLETE_LEVEL)
            if block[0] == 'b':
                checkpoint = (block[1].left-40,block[1].top)
                levelImage.changeBannerRed(block[1])
        
        
        ### Draw nose and wig, if bought
        if shop[1]["bought"]:
            pygame.draw.circle(SURFACE, pygame.Color("red"),(73,cyclist.y+10),2)
        if shop[0]["bought"]:
            SURFACE.blit(WIG, (45,cyclist.y-10))
        ### Draw space helmet, if level is 6
        if level == 5:
            alphaSurface = pygame.Surface((640,480,),pygame.SRCALPHA)
            pygame.draw.circle(alphaSurface,pygame.Color(190,190,190,140),((68,cyclist.y+6)),15)
            pygame.draw.circle(alphaSurface,pygame.Color(0,0,0),((68,cyclist.y+6)),15,2)
            SURFACE.blit(alphaSurface, (0,0))
        if keys[pygame.K_LEFT]: 
            cyclist.accelerate(-1 * multiplier)
        if keys[pygame.K_RIGHT]: 
            cyclist.accelerate(multiplier)
        
        if keys[pygame.K_DOWN]: 
            #Lean back
            pass
        if (keys[pygame.K_SPACE] and not cyclist.isJumping):
            cyclist.initJump()

    #-----------------------------------------------------------------------------

    elif state == STATE_START_LEVEL:
        pygame.time.wait(2000)
        reset()
        state = STATE_PLAY
    
    #-----------------------------------------------------------------------------

    elif state == STATE_RETURN_TO_CHECKPOINT:
        pygame.time.wait(2000)
        cyclist = Cyclist(SURFACE, levelImage, checkpoint)
        if shop[2]["bought"]:
            cyclist.setTopSpeed(25)
        if shop[3]["bought"]:
            cyclist.setInitialJumpSpeed(-48)
        if level == 5:
            cyclist.setLowGravity()
        state = STATE_PLAY

    #-----------------------------------------------------------------------------

    elif state == STATE_SHOP:
        SURFACE.blit(CLOWNSHOP, (0,0))
        coinText = COIN_FONT.render(str(coins),True, BLACK)
        SURFACE.blit(coinText, (287,30))
        pygame.event.get()
        events = pygame.mouse.get_pressed()
        coords = (0,0)
        for m in events:
            if True in events:
                coords = pygame.mouse.get_pos()
                if BACK_RECT.collidepoint(coords):
                    state = STATE_LEVEL_SELECT
                else:
                    for item in shop:
                        if item["rect"].collidepoint(coords):
                            buy(item)

    
    #-----------------------------------------------------------------------------
    
    elif state == STATE_LEVEL_SELECT:
        SURFACE.blit(LEVELSELECT, (0,0))
        # Check mouse to see if clicked on a level
        pygame.event.get()
        events = pygame.mouse.get_pressed()
        coords = (0,0)
        for m in events:
            if True in events:
                coords = pygame.mouse.get_pos()
        
        for i in range (6):
            if levels[i]["locked"]:
                SURFACE.blit(LOCK, (levels[i]["selectRect"].left + 20, levels[i]["selectRect"].top + 20))
            if levels[i]["selectRect"].collidepoint(coords):
                if levels[i]["locked"]:
                    lockedText = COIN_FONT.render(f"Level {i + 1} is locked!",BLACK,True)
                    SURFACE.blit(lockedText,(400,440))
                else:
                    level = i
                    reset()
                    state = STATE_PLAY
            elif SHOP_RECT.collidepoint(coords):
                setState(STATE_SHOP)

    #-----------------------------------------------------------    
    
    pygame.display.update()
    FramePerSec.tick(FPS)
