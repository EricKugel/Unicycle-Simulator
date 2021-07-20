import pygame
from pygame.locals import *

ACCELERATION = 2
PARACHUTE = pygame.image.load("images/chute.png")

class Cyclist():
    def __init__(self, surface, levelImage, checkpoint):
        self.isJumping = False
        self.isChuting = False
        self.surface = surface
        self.levelImage = levelImage
        self.x = checkpoint[0]
        self.y = checkpoint[1]
        self.topspeed = 15
        self.initialjumpspeed = -36
        self.closestYUnder = 320
        self.column = 0
        self.accelerationMultiplier = 1
        self.xSpeed = 0
        self.ySpeed = 0
        self.animationImages = [
            pygame.image.load("spriteImages/cyclist0.png"),
            pygame.image.load("spriteImages/cyclist1.png"),
            pygame.image.load("spriteImages/cyclist2.png"),
            pygame.image.load("spriteImages/cyclist3.png")
        ]
        self.animationTick = 0

    def update(self, chuting):
        self.x += self.xSpeed
        self.y += self.ySpeed
        self.isChuting = chuting

        # Fall if necessary
        if((not self.isJumping) and self.y+80 < self.closestYUnder):
            self.ySpeed = 0
            self.isJumping = True
        
        # Continue jumping
        elif(self.isJumping):
            # If at peak of jump (not fall, hence elif), reupdate closestYUnder
            if(self.ySpeed == 0):
                self.closestYUnder = self.levelImage.getClosestYUnder(self.x+60, self.y+80)
            self.ySpeed +=6
            if(self.isChuting and self.ySpeed > 0):
                self.ySpeed = 6
            if(self.y + 80 > self.closestYUnder):
                self.ySpeed = 0
                self.isJumping = False
                self.y = self.closestYUnder - 80

        if(int((self.x+20)/40) != self.column):
            self.column = int((self.x+20)/40)
            self.closestYUnder = self.levelImage.getClosestYUnder(self.x+60, self.y+80)
        
        # Friction decelerates
        if(self.xSpeed > 0):
            self.accelerate(-0.5)
        elif(self.xSpeed < 0):
            self.accelerate(0.5)
        
        blocksTouching = self.levelImage.getInteractiveBlocksTouching(pygame.Rect(self.x+50,self.y,20,81))
        blocks = []
        for block in blocksTouching:
            if block[0] == 't':
                # Boing!
                self.isJumping = True
                self.ySpeed = -48
            else:
                blocks.append(block)
    
            

        if not self.isJumping:
            self.animationTick += self.xSpeed
        if (self.animationTick >= 80 or self.animationTick <= -80):
            self.animationTick = 0
        
        image = (self.animationImages[int(self.animationTick/20)])
        self.surface.blit(image,(40, self.y))
        if (self.isChuting and self.ySpeed > 0):
            self.surface.blit(PARACHUTE,(10,self.y-20))

        return blocks
        
    def accelerate(self, multiplier):
        self.xSpeed += (ACCELERATION * self.accelerationMultiplier * multiplier)
        if(self.xSpeed > self.topspeed or self.xSpeed < -1 * self.topspeed):
            self.xSpeed -= (ACCELERATION * self.accelerationMultiplier * multiplier)

    def initJump(self):
        self.isJumping = True
        self.ySpeed = self.initialjumpspeed

    def setTopSpeed(self, topSpeed):
        self.topspeed = topSpeed

    def setInitialJumpSpeed(self, jumpSpeed):
        self.initialjumpspeed = jumpSpeed