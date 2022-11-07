class LevelImage {
    constructor(ctx, level) {
        this.ctx = ctx;
        this.level = level;
        this.levelArray = LEVEL_FILES[level].split("\n");
    }

    drawLevel(x) {
        for (var line = 0; line < this.levelArray.length; line++) {
            for (var char = 0; char < this.levelArray[line].length; char++) {
                if (this.levelArray[line][char] != " " && this.levelArray[line][char] != "c") {
                    this.ctx.drawImage(cache[this.levelArray[line][char]], char * 40 - x, line * 40);
                }
            }
        }
    }

    getClosestYUnder(x, y) {
        var column = Math.floor(x / 40);
        var cells = [];
        for (var line = 0; line < this.levelArray.length; line++) {
            var cell = this.levelArray[line][column];
            if ("ldght".includes(cell)) {
                cells.push(line * 40);
            }
        }
        var closestPoint = 480;
        for (var i = 0; i < cells.length; i++) {
            var yPoint = cells[i];
            if (yPoint < closestPoint && yPoint >= y) {
                closestPoint = yPoint;
            }
        }
        return closestPoint;
    }

    getInteractiveBlocksTouching(rect) {
        var blocksTouching = [];
        for (var line = 0; line < this.levelArray.length; line++) {
            for (var char = 0; char < this.levelArray[line].length; char++) {
                var block = this.levelArray[line][char];
                if ("$stfbp".includes(block)) {
                    var blockRect = [char * 40, line * 40, 40, 40];
                    if (!(rect[0] >= blockRect[0] + blockRect[2] || rect[1] >= blockRect[1] + blockRect[3] || rect[0] + rect[2] <= blockRect[0] || rect[1] + rect[3] <= blockRect[1])) {
                        blocksTouching.push([block, blockRect]);
                    }
                }
            }
        }
        return blocksTouching;
    }

    removeCoin(coinRect) {
        var row = Math.floor(coinRect[1] / 40);
        var col = Math.floor(coinRect[0] / 40);
        this.levelArray[row] = this.levelArray[row].substring(0, col) + " " + this.levelArray[row].substring(col + 1);
    }

    changeBannerRed(bannerRect) {
        var row = Math.floor(bannerRect[1] / 40);
        var col = Math.floor(bannerRect[0] / 40);
        this.levelArray[row] = this.levelArray[row].substring(0, col) + "r" + this.levelArray[row].substring(col + 1);
    }   
}

LEVEL_FILES = [
`                                                                                                                  f
                $$$                                                                                               f
                $$$                                                                                    $          f
                lll                                                                         $   $$      $$$       f
          $$$$           $$                                                      $$$               $$         $   f
          llll           ll                                              $$     lllll     $    $$      $$$        f
     $$                                              $$$       $$$$     lllll                               $$    f
    llll                                            lllll     lllllll                              $              f
                                        b                                              b     $                    f
        ss  ss  t     tssssssss         p   ss  ss  ssssssss  s s s s s s s s s s s s  p  t s t s t t s s t s t s f
ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd`,

`llllllllllllllllllllllllllll                                     $$$$$$$$$                            f
                                                                 lllllllll                            f
                                                            $$                                        f
                                                            ll                                        f
            $         $     $                                                          $              f
    $   $   $     $   $     $                                   $                    $$$$$            f
    $   $   t     $   t     t                                $  l                   $$$ $$$           f
    l   l   l     l   l     l                                l                     $$     $$          f
                                    b                                           b                     f
      tsssssssssssssssssssssssssss  p     $$$$$$$$$$$$$$     ssssssssssssssss   p  tsssst             f
lllllllllllllllllllllllllllllllllllllllls $$$$$$$$$$$$$$  sllllllllllllllllllllllllllllllllllllllllllll
lllllllllllllllllllllllllllllllllllllllllllllllsllllllsllllllllllllllllllllllllllllllllllllllllllllllll`,

`                           
$       l$        $        $
 $     l$ $      $ $      $ 
  $   l$   $    $   $    $  
   $ l$     $  $     $  $   
    $$       $$       $$    
   l$$       $$       $$    
  l$  $     $  $     $  $   
 l$    $   $    $   $    $  
 $      $ $      $ $      $ 
$        $        $        $
gggggggggggggggggggggggggggg`,


`llllllllllll                                $$$$$$$$$$$$$$                $                            f                                              
llllllll                                    llllllllllllll                $                            f     tt tt                                   
llll                                                                      $                            f   lllllllll                               
ll                                                                        t                            f   lsssssssl                                 
l                                                                      slllls$                         f   s       s                                
                    $$$$$$                      t                    slllllllllls$                     f   s       s                                
                  slllllll                      l                 sllllllllllllllllls$                 f   s       s                                
               sllllllll    $                              $$ sllllllllllllllllllllllllls$             f   lsssssssl                                   
           sllllllllllll     $          b            $$  sllllllllllllllllllllllllllllllllls$          f   lllllllll                            
       sllllllllllllllllssss   ss  s    p   t      sllllllllllllllllllllllllllllllllllllllllllls $$$$$ f    lllllll   
lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll`,

`                                h      h                                 q q q q q q q   $$$$$$$$$$$   f
                                q$$$$$$q  $$s$$s$$s$$ss$$s               q q q qgqgqgq   $$$$$$$$$$$   f
                      $         qggggggq  gggggggggggggggg               q q qgq q q q   ggsggggssgg   f
                   $  h  $$     q      q                                 q qgq q q q q                 f
                $  h  q  $$     q$$$$$$q  $                              q q qgq q q q                 f
             $  h  q  q  ll     qggggggq  h$                             q q q qgq q q                 f
          $  h  q  q  q         q      q  qh$            $  $  $  t      q q qgq q q q                 f
       $  h  q  q  q  q         q$$$$$$q  qqh$           h  h  h  h      q qgq q q q q                 f
    $  h  q  q  q  q  q      b  qggggggq  qqqh$         hq  q  q  q      qgq q q q q q                 f
    h sq  q  q sq  q  q ssss p  q      q  qqqqh$       hqqssqssqssqss    q q q q q q q                 f
gggggggggggggggggggggggggggggggggggggggggggggggsgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd`,

`                                                      $$$$$$$$$$$$                                    f
                                         t            $$$$$$$$$$$$                sssss               f
                                                t     llllllllllll                $$$$$               f
                                     t                                           $     $              f
                                t                                               $ ll ll $             f
                           t                                                    $       $             f
                       t                                                        $ l   l $             f
             $$                    $$$$$$                        lll lll        $  lll  $             f
            $  $     t       $$  sgggggggggs   $$            b                 s $     $ s            f
           t    t    $$$  sgggggggdddddddddggggggggggggs     p   ss   ss      l   $$$$$   l           f
gggggggggggg    gggggggggggddddddddddddddddddddddddddddgggggggggggs   sggggggggggggggggggggggggggggggggggggggggggggg
dddddddddddd    dddddddddddllllllllllllllllllllllllllllddddddddddds   sddddddddddddddddddddddddddddddddddddddddddddd`,

`                        $$$$$$                                                                                                                                                                  f
                        $$$$$$                                                                                                                                                                  f
                        llllll                                                                                                                                                                  f
                                                                                                                                                          $$$$$$$$$$$$$$$$$                     f
            llllll                                                                                                 $$$$                                $$$$$$$$$$$$$$$$$$$$$$                   f
                                                                                                                  llllll                              $$$$$$$     l    $$$$$$$                  f
                                                                                          $$$$$$               $                                     $$$$$                $$$$$                 f
                             s                                                            llllll               l                                    $$$$$   l           l  $$$$$   lllll        f
                        llllll                                                                           $$$                                       $$$                       $$$$               f
            llllll                                     $ $ $ $ $ $ $ $ $ $   llll                      lllllll                                    $$   l                      l$$$              f
llllll                                    llllllllllll l l l l l l l l l l                                                            $$         $                               $$             f
                                                                                                                                    llllll       l                                 $            f`
]
