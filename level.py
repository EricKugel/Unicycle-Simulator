# This module takes a DISPLAYSURF and draws on it the level using the level.txt file.
import pygame
from pygame.locals import *
import os

# The levels are in text files in the levelFiles folder. I use certain characters to represent certain things: for example, '$' means gilded juggling ball

class LevelImage():
    def __init__(self, surface, level):
        self.surface = surface
        self.level = level
        self.levelArray = []
        self.blockImages = {}

        levelFile = open("levelFiles/level" + str(level+1) + ".txt")
        for i in range (12):
            levelLine = levelFile.readline()
            levelLinearray = []
            for char in levelLine:
                if not char == "\n":
                    levelLinearray.append(char)
            self.levelArray.append(levelLinearray)

        for filename in os.listdir('blockImages'):
            self.blockImages[filename[0:1]] = pygame.image.load("blockImages/"+filename)
    def drawLevel(self, x):
        for line in range (len(self.levelArray)):
            for char in range (len(self.levelArray[line])):
                if not self.levelArray[line][char] == ' ' and not self.levelArray[line][char] == 'c':
                    self.surface.blit(self.blockImages[self.levelArray[line][char]], (char*40 - x,line*40,40,40))
    def getClosestYUnder(self,x,y):
        column = int(x/40)
        cells = []
        for line in range (len(self.levelArray)):
            cell = self.levelArray[line][column]
            if (cell == '_' or cell == 'd' or cell == 'g' or cell == 'h' or cell == 't'):
                cells.append(line * 40)
        closestPoint = 480
        for yPoint in cells:
            if(yPoint < closestPoint and yPoint >= y):
                closestPoint = yPoint
        return closestPoint

    def getInteractiveBlocksTouching(self, rect):
        blocksTouching = []
        for line in range (len(self.levelArray)):
            for char in range (len(self.levelArray[line])):
                block = self.levelArray[line][char]
                if block in ['$','s','t','f','b','p']:
                    blockRect = pygame.Rect(char*40,line*40,40,40)
                    if rect.colliderect(blockRect):
                        blocksTouching.append((block,blockRect))
        return blocksTouching
    
    def removeCoin(self, coinRect):
        coinCol, coinRow = int(coinRect.left/40), int(coinRect.top/40)
        self.levelArray[coinRow][coinCol] = ' '
    
    def changeBannerRed(self, bannerRect):
        bannerCol, bannerRow = int(bannerRect.left/40), int(bannerRect.top/40)
        self.levelArray[bannerRow][bannerCol] = 'r'