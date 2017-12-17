    let gameField;
    let player;
    let aliens;
    let cursors;
    let bullets;
    let bulletTime = 0;
    let fireButton;
    let fx;
    let alien;
    let createAlienTimer = 0;
    let inTheWorld;
    let livingEnemies = [];
    let firingTimer = 0;
    let enemyBullet;
    let explosions;
    let score = 0;
    let scoreString = '';
    let scoreText;
    let stateText;
    let lives;
    let alienLives;
    let x = 0;
    let helth;
    let helthAlien;
    let gameTime = 0; 
    let aidTimer = 0;
    let firstAid;
    let aid;
    let numberOfLives = 0;
    let canvas;
    let checkPlayerAlive = true;
    let startGameTime;
    let gameButton;
    let buttonGroup;
    let button;
    let textGroup;
    let changeScore = true;
    let engineExhaust;
    let countOfAnimationDown = 0;
    let countOfAnimationUp = 0;

var Game = 
{
    preload: function() {
        game.load.image('gameField', 'assets/img/remember-me2.jpg');
        game.load.spritesheet('dude', 'assets/img/goodBoy.png', 140, 70);
        game.load.spritesheet('engineExhaust', 'assets/img/engineExhaust2.png', 50, 50);
        game.load.image('bullet', 'assets/img/bullet.png');
        game.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        game.load.image('enemyBullet', 'assets/img/enemy-bullet.png');
        game.load.image('heart', 'assets/img/heart.png');
        game.load.image('firstAidAid', 'assets/img/firstaid.png');
        game.load.spritesheet('invader', 'assets/img/1.png', 39, 46);
        game.load.spritesheet('kaboom', 'assets/img/explode.png', 128, 128);
        game.load.spritesheet('helth', 'assets/img/Untitled-2.png', 34, 6);
        game.load.spritesheet('button', 'assets/img/flixel-button.png', 80, 20);
        game.load.bitmapFont('nokia', 'assets/fonts/nokia16black.png', 'assets/fonts/nokia16black.xml');
    },
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        gameField = game.add.tileSprite(0, 0, 1920, 944, 'gameField');
        game.world.setBounds(0, 200, 1000, 600);
        this.createPlayer();
        scoreString = 'Score : ';
        scoreText = game.add.text(10, 200, scoreString + score, { font: '34px Arial', fill: '#fff' });

        lives = game.add.group();
        game.add.text(10, 250, 'Lives : ', { font: '34px Arial', fill: '#fff' });

        for (; numberOfLives < 3; numberOfLives++) {
            this.createLives(numberOfLives);
        }

        this.createAlienGroup();

        this.createGroupFirstAid();         

        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        this.createEnemyBulletsGroup();
        
        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(this.setupInvader, this);

        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;
        
        fx = game.add.audio('sfx');
        fx.allowMultiple = true;
        fx.addMarker('shot', 17, 1);
        fx.addMarker('death', 12, 2);
        fx.addMarker('ping', 10, 0.4);

        canvas = document.getElementsByTagName('canvas')[0];
        startGameTime = game.time.now;
    },
    createEnemyBulletsGroup: function () {
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);
    },
    createGroupFirstAid: function() {
        aid = game.add.group();
        aid.enableBody = true;
        aid.physicsBodyType = Phaser.Physics.ARCADE;   
    },
    createButtonGroup: function() {
        buttonGroup = game.add.group();
        textGroup = game.add.group();
    },
    createAlienGroup: function() {
        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;
        helth = game.add.group();
        helth.enableBody = true;
        helth.physicsBodyType = Phaser.Physics.ARCADE; 
    },
    createPlayer: function() {
        player = game.add.sprite(60, game.world.height - 150, 'dude');
        game.camera.follow(player);
        player.animations.add('up', [4, 3, 2, 1, 0], 50);
        player.animations.add('down', [6, 7, 8, ,9, 10], 50);
        player.animations.add('move', [5]);
        
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        engineExhaust = game.add.sprite(17, game.world.height - 140, 'engineExhaust');
        // engineExhaust.angle = 90;
        engineExhaust.animations.add('fire', [0,1,2,3,4,5,6,7], 20, true);
        engineExhaust.play('fire');
        game.physics.arcade.enable(engineExhaust);
        engineExhaust.body.collideWorldBounds = true;
         //engineExhaust.events.onOutOfBounds.add(this.stopEngineExhaust, this );


    },
    stopEngineExhaust: function() {
        if (cursors.left.isDown)
        {
            player.body.velocity.x = 0;
          //  engineExhaust.body.velocity.x = -240;
        }

       //  player.body.velocity.x = 0;
        // player.body.velocity.y = 0;
    },
    createLives: function(n) {
        player.heart = lives.create(140 + (50 * n), 270, 'heart');
        player.heart.anchor.setTo(0.5, 0.5);
    },
    createFirstAid: function() {
        let createCordinateForAid = game.rnd.between(50, 550);
        let speedForAid = game.rnd.between(-40, -120);
        firstAid = aid.create(0, createCordinateForAid, 'firstAidAid');
        firstAid.body.velocity.x = speedForAid;
        firstAid.checkWorldBounds = true;
        aid.x = 1000;
        aid.y = 200;
        aidTimer =  game.time.now + 10000;
    },
    createAliens: function(speedAppearAliens) {
        let createCordinate = game.rnd.between(50, 550);
        alien = aliens.create(0, createCordinate, 'invader');
        let speed = game.rnd.between(-40, -120);
        alien.body.velocity.x = speed;
        alien.anchor.setTo(0.5, 0.5);
        alien.animations.add('fly', [ 0, 1], 5, true);
        alien.play('fly');
        alien.body.collideWorldBounds = false;
        alien.checkWorldBounds = true;
        alien.events.onOutOfBounds.add(this.goodbyeAlien, this );
        alien.helthAlien = helth.create(-11, createCordinate - 40, 'helth');
        alien.helthAlien.animations.add('flyHelth', [ 0, 1, 2,], 1, true);
        alien.helthAlien.frame = 2;
        alien.helthAlien.body.velocity.x = speed;
        alien.aLives = game.add.group();
        for (var j = 0; j < 3; j++) {
            alien.aLives.create();
        }   
        helth.x = 1000;
        helth.y = 200;
        aliens.x = 1000;
        aliens.y = 200;
        createAlienTimer = game.time.now + speedAppearAliens;
    },
    setupInvader: function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },
    update: function() {
    	gameField.tilePosition.x += -2;
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        engineExhaust.body.velocity.x = 0;
        engineExhaust.body.velocity.y = 0;
        if (cursors.left.isDown && engineExhaust.position.x > 5)
        {
            player.body.velocity.x = -240;
            engineExhaust.body.velocity.x = -240;
           //  console.log(engineExhaust.position.x);
        }
        if (cursors.right.isDown)
        {
            player.body.velocity.x = 240;
            engineExhaust.body.velocity.x = 240;

        }
        if (cursors.up.isDown && engineExhaust.position.y > 218)
        {
            player.body.velocity.y = -240;
            engineExhaust.body.velocity.y = -240;
             this.animationUp();
             console.log(engineExhaust.position.y);
            
        } 
        if (cursors.down.isDown && engineExhaust.position.y < 728)
        {
            player.body.velocity.y = 240;
            engineExhaust.body.velocity.y = 240;
            this.animationDown();
         }
        if(cursors.down.isUp && cursors.up.isUp && cursors.right.isUp && cursors.left.isUp){
        	player.animations.play('move');
        }
        if(cursors.down.isUp) countOfAnimationDown = 0;
        if(cursors.up.isUp) countOfAnimationUp = 0;
    

        if (fireButton.isDown && checkPlayerAlive === true) 
        {
            this.fireBullet();
        }

        if(startGameTime + 1000 < game.time.now && startGameTime + 20000 > game.time.now) {
            if (game.time.now > createAlienTimer)
            {
                    this.createAliens(900);
           	}
        }

        if(startGameTime + 20000 < game.time.now && startGameTime + 60000 > game.time.now) {
            if (game.time.now > createAlienTimer)
            {
                    this.createAliens(400);
            }
        }

        if(startGameTime + 60000 < game.time.now && startGameTime + 110000 > game.time.now) {
            if (game.time.now > createAlienTimer)
            {
                    this.createAliens(300);
            }
        }
        
        if (game.time.now > firingTimer)
        {
            this.enemyFires();
        }
        if(game.time.now > aidTimer) {
            this.createFirstAid();
        }

        if(numberOfLives < 3) {
            game.physics.arcade.overlap(player, aid, this.addLives, null, this);
        }
        if(score < 0 && changeScore === true) {
            player.kill();
            engineExhaust.kill();
            checkPlayerAlive = false;
            this.createButtonGroup();
            this.createEndGameMenu('Game over!');
        }
        if( game.time.now - startGameTime > 110000 && livingEnemies.length === 0 && changeScore === true) {
            player.kill();
            engineExhaust.kill();
            checkPlayerAlive = false;
            this.createButtonGroup();
            this.createEndGameMenu('You win!');
        }
        game.physics.arcade.overlap(bullets, aliens, this.collisionHandler, null, this);
    	game.physics.arcade.overlap(player, aliens, this.collisionPlayer, null, this);
    	game.physics.arcade.overlap(enemyBullets, player, this.enemyHitsPlayer, null, this);
        // game.physics.arcade.overlap(engineExhaust, player, this.stopEngineExhaust, null, this);
    },
    animationUp: function() {
        if(countOfAnimationUp === 0) {
            player.animations.play('up');
            countOfAnimationUp++;
        }
    },
    animationDown: function() {
        if(countOfAnimationDown === 0) {
            player.animations.play('down');
            countOfAnimationDown++;
        }
    },
    addLives: function(player,firstAid) {
        firstAid.kill();
        lives.kill();
        lives = game.add.group();
        numberOfLives += 1;
        for(var i = 0; i < numberOfLives; i++) {
            fx.play('ping');
            this.createLives(i);
        }
    },
    goodbyeBullet: function(bullet) {
    	bullet.kill();
    }, 
     goodbyeAlien: function(alien) {
    	alien.kill();
    	score -= 20;
        scoreText.text = scoreString + score;
    },
     goodbyeEnemyBullet: function(enemyBullet) {
        enemyBullet.kill();
     },
     lockGame: function() {
    	game.lockRender = true;
    },
    collisionPlayer:  function(player, alien) {
        this.createButtonGroup();
    	player.kill();
        engineExhaust.kill();
        alien.kill();
        alien.helthAlien.kill();
        fx.play('death');
        this.createEndGameMenu('Game over!');
        checkPlayerAlive = false;

        let explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
    },
    collisionHandler: function(bullet, alien) {
        bullet.kill();
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
        liveAlien = alien.aLives.getFirstAlive();
    	if (liveAlien)
        {
            liveAlien.kill();
            alien.helthAlien.frame -= 1;
            alien.body.velocity.x += 10;
            alien.helthAlien.body.velocity.x += 10;
        }
       if(alien.aLives.countLiving() < 1) {
            score += 20;
            scoreText.text = scoreString + score;
       		alien.helthAlien.kill();
       	    alien.kill();
            fx.play('death');
        } 
    },
    fireBullet: function() {
    	// Number of blocks will be optimized	
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime)
        {
            //  Grab the first bullet we can from the pool
            bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                //  And fire it
                fx.play("shot");
                bullet.reset(player.x + 50, player.y + 20);
                bullet.body.velocity.x = 400;
                bulletTime = game.time.now + 450;
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.goodbyeBullet, this );
            }

            bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                //  And fire it
                fx.play("shot");
                bullet.reset(player.x + 50, player.y + 20);
                bullet.body.velocity.x = 400;
                bullet.body.velocity.y = 200;
                bulletTime = game.time.now + 450;
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.goodbyeBullet, this );
            }
            bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                //  And fire it
                fx.play("shot");
                bullet.reset(player.x + 50, player.y + 20);
                bullet.body.velocity.x = 400;
                bullet.body.velocity.y = -200;
                bulletTime = game.time.now + 450;
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.goodbyeBullet, this ); 
            }
             bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                //  And fire it
                fx.play("shot");
                bullet.reset(player.x + 50, player.y + 20);
                bullet.body.velocity.x = 400;
                bullet.body.velocity.y = 100;
                bulletTime = game.time.now + 450;
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.goodbyeBullet, this );
            }
             bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                //  And fire it
                fx.play("shot");
                bullet.reset(player.x + 50, player.y + 20);
                bullet.body.velocity.x = 400;
                bullet.body.velocity.y = -100;
                bulletTime = game.time.now + 450;
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.goodbyeBullet, this );
            }
        }
    },
    enemyFires: function() { 
        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);
        enemyBullet.checkWorldBounds = true;
        // It's doesn't works, I do not know why.
        // enemyBullet.onOutOfBounds.add(this.goodbyeEnemyBullet, this);
        livingEnemies.length=0;
        aliens.forEachAlive(function(alien){
        // put every living enemy in an array
            livingEnemies.push(alien);
        });
        if (enemyBullet && livingEnemies.length > 0)
        {
            var random = game.rnd.integerInRange(0,livingEnemies.length-1);
            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

           // enemyBullet.checkWorldBounds = true;
           // enemyBullet.events.onOutOfBounds.add(this.goodbyeEnemyBullet, this);

            game.physics.arcade.moveToObject(enemyBullet,player,120);
            firingTimer = game.time.now + 1000;
            if (enemyBullet.position.x === 0) {
                enemyBullet.kill();
            }


        }
    },
    enemyHitsPlayer: function(player,bullet) {
        lives.kill();
        lives = game.add.group();
        numberOfLives -= 1;
        for(var i = 0; i < numberOfLives; i++) {
            this.createLives(i);
        }
        bullet.kill();
        fx.play('death');
        //  number of explosion blocks will be optimized
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
        if (lives.countLiving()  === 0) {
            player.kill();
            engineExhaust.kill();
            checkPlayerAlive = false;
            this.createButtonGroup();
            this.createEndGameMenu('Game over!');
        }
    },
    restart: function() {
        score = 0;
        aid.kill();
        helth.kill();
        enemyBullets.kill();
        buttonGroup.kill();
        textGroup.kill();
        aliens.kill();
        engineExhaust.kill();
        checkPlayerAlive = true;
        this.createGroupFirstAid();
        this.createPlayer();
        this.createAlienGroup();
        this.createEnemyBulletsGroup();
        startGameTime = game.time.now;
        stateText.visible = false;
        lives.kill();
        lives = game.add.group();
        numberOfLives = 0;
        changeScore = true;
        for (; numberOfLives < 3; numberOfLives++) {
            this.createLives(numberOfLives);
        } 
        scoreText.text = scoreString + score;
    }, 
    createEndGameMenu: function(text) {
        this.makeButton('New game', 320, 600);
        this.makeButton('Main', 520, 600);
        stateText.text = text;
        stateText.visible = true; 
        changeScore = false;
    },
    makeButton: function(name, x, y) {
        var button = game.make.button(x, y, 'button', this.click, this, 2, 1, 0);
        buttonGroup.add(button);
        button.name = name;
        button.scale.set(2, 1.5);
        button.smoothed = false;
        var text = game.add.bitmapText(x, y + 7, 'nokia', name, 16);
        text.x += (button.width / 2) - (text.textWidth / 2);
        buttonGroup.add(button);
        textGroup.add(text);
    }, 
    click: function(button) {
        if (button.name === 'New game') {
            this.restart();
        } else {
            this.restart();
            game.paused = true;
            canvas.classList.add('hide');
            isItFirstEnter = false;
            LANDING.classList.remove('hide');
        }
    }
}