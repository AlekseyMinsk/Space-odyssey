    let gameField;
    let player;
    let aliens;
    let cursors;
    let bullets;
    let bulletTime = 0;
    let fireButton;
    let fx;
    let fxFire;
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
    let weaponUp;
    let weaponType;
    let weaponCheck = true;
    let weaponTimer = 0;
    let weapon1 = false;
    let weapon2 = false;
    let weapon3 = false;
 var Game = 
{
    preload: function() {
        game.load.image('gameField', 'assets/img/remember-me2.jpg');
        game.load.spritesheet('dude', 'assets/img/goodBoy.png', 140, 70);
        game.load.spritesheet('engineExhaust', 'assets/img/engineExhaust2.png', 50, 50);
        game.load.image('bullet', 'assets/img/bullet.png');
        game.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        game.load.audio('laserfire', 'assets/audio/laserfire.ogg');
        game.load.image('enemyBullet', 'assets/img/enemy-bullet.png');
        game.load.image('heart', 'assets/img/heart2.png');
        game.load.image('firstAidAid', 'assets/img/firstAid.png');
        game.load.image('weaponUp', 'assets/img/weaponUp.png');
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
        this.createGroupWeaponUp();        

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

        fxFire = game.add.audio('laserfire');
        fxFire.allowMultiple = true;
        fxFire.addMarker('shot', 0, 0.5);


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
        player = game.add.sprite(160, game.world.height - 150, 'dude');
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        game.camera.follow(player);
        player.animations.add('up', [4, 3, 2, 1, 0], 50);
        player.animations.add('down', [6, 7, 8, ,9, 10], 50);
        player.animations.add('move', [5]);
        
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.collideWorldBounds = true;
        engineExhaust = game.add.sprite(40, game.world.height - 174, 'engineExhaust');
        // engineExhaust.angle = 90;
        engineExhaust.animations.add('fire', [0,1,2,3,4,5,6,7], 20, true);
        engineExhaust.play('fire');
        game.physics.arcade.enable(engineExhaust);
        engineExhaust.body.collideWorldBounds = true;
        weapon1 = true;
        weapon2 = false;
        weapon3 = false;
         //engineExhaust.events.onOutOfBounds.add(this.stopEngineExhaust, this );
    },
    stopEngineExhaust: function() {
        if (cursors.left.isDown)
        {
            player.body.velocity.x = 0;
        }
    },
    createLives: function(n) {
        player.heart = lives.create(140 + (50 * n), 270, 'heart');
        player.heart.anchor.setTo(0.5, 0.5);
        player.heart.alpha = 0.7;
    },
    createGroupFirstAid: function() {
        aid = game.add.group();
        aid.enableBody = true;
        aid.physicsBodyType = Phaser.Physics.ARCADE;   
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
    createGroupWeaponUp: function() {
        weaponUp = game.add.group();
        weaponUp.enableBody = true;
        weaponUp.physicsBodyType = Phaser.Physics.ARCADE;   
    },
    createWeaponUp: function() {
        let createCordinate = game.rnd.between(50, 550);
        let speed = game.rnd.between(-40, -120);
        weaponType = weaponUp.create(0, createCordinate, 'weaponUp');
        weaponType.body.velocity.x = speed;
        weaponType.checkWorldBounds = true;
        weaponUp.x = 1000;
        weaponUp.y = 200;
        weaponTimer =  game.time.now + 20000;
    },
    upgreatWeapon: function() {
        if(weapon1 === true) {
            weapon1 = false;
            weapon2 = true;
        } else if (weapon2 === true) {
            weapon2 = false;
            weapon3 = true;
            weaponCheck = false;
        }
        weaponType.kill();
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
    

        /* if (fireButton.isDown && checkPlayerAlive === true) 
        {
            this.fireBullet();
        } */ 
        if (fireButton.isDown && checkPlayerAlive === true && weapon1 ===  true) {
            this.createFireBullet(400, 0, fx,1);

        }
        if (fireButton.isDown && checkPlayerAlive === true && weapon2 ===  true) {
            this.createFireBullet(400, 0, fx);
            this.createFireBullet(400, 100, fx);
            this.createFireBullet(400, -100, fx, 1);
        }
        if (fireButton.isDown && checkPlayerAlive === true && weapon3 ===  true) {
            this.createFireBullet(400, 0, fxFire);
            this.createFireBullet(400, 100, fxFire);
            this.createFireBullet(400, -100, fxFire);
            this.createFireBullet(400, 200, fxFire);
            this.createFireBullet(400, -200, fxFire, 1);
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
        if(game.time.now > weaponTimer && weaponCheck === true) {
            this.createWeaponUp();
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
        game.physics.arcade.overlap(weaponUp, player, this.upgreatWeapon, null, this);

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
    createFireBullet: function(x,y,sound,j) {
          if (game.time.now > bulletTime) {
            sound.play('shot');
            bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                bullet.reset(player.x, player.y);
                bullet.body.velocity.x = x;
                bullet.body.velocity.y = y;
                bullet.checkWorldBounds = true;
                bullet.events.onOutOfBounds.add(this.goodbyeBullet, this );
            }
            if(j)
                // sound.play('shot');
                bulletTime = game.time.now + 450;
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
            firingTimer = game.time.now + 2000;
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
        explosion.reset(player.x, player.y);
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
        weaponUp.kill();
        helth.kill();
        enemyBullets.kill();
        buttonGroup.kill();
        textGroup.kill();
        aliens.kill();
        engineExhaust.kill();
        checkPlayerAlive = true;
        weaponCheck = true;
        this.createGroupFirstAid();
        this.createGroupWeaponUp();
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