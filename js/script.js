var enemysPosition = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var enemyDistance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var enemyTemplate = "<div class='enemy live'></div>";
var enemysTemplate = "<div class='enemys'></div>";
var enemysLeft = 0;
var world = $(".world");
var worldStep = 5;
var heroTemplate = "<div class='hero'></div>";
var jumpHeight = 5;
var jumpSpeed = 10;
var jumpPermission = true;
var gameOver = false;
var gameSpeed = 10;

for (var i = 0; i < 100; i++) {
  enemysPosition = enemysPosition.concat(enemyDistance)
  enemysPosition.push(Math.random().toFixed())
  if (enemyDistance.length <= 10) {
    continue
  }
  enemyDistance.shift();
}

world.append(heroTemplate).append(enemysTemplate)

for (var i = 0; i < enemysPosition.length; i++) {
  if (enemysPosition[i] == 0) continue;
  $(".enemys").append(enemyTemplate).find(".enemy").last().attr("style", "left:" + i * 10 + "px");
}

var enemy = new CreateObject("live", 10, 20);
var hero = new CreateObject("hero", 10, 20);

function CreateObject(name, width, height) {
  this.left = function() {
    return +$("." + name).position().left.toFixed()
  };
  this.top = function() {
    return +$("." + name).position().top.toFixed()
  };
  this.height = function() {
    $("." + name).height(height)
    return $("." + name).height()
  };
  this.width = function() {
    $("." + name).width(width)
    return $("." + name).width()
  }
  this.height();
  this.width();
}

enemy.destroy = function() {
  if (!$(".enemys").find(".enemy.live").first()) return false;
  $(".enemys").find(".enemy.live").first().removeClass("live");
  return this.left();
};

hero.jump = function(value) {

  var oldPos = parseFloat($(".hero").css("bottom"))
  var newPos = value;
  var currentPos = parseFloat($(".hero").css("bottom"))

  jumpPermission = false;

  function jumpUp() {
    var jumpUpTimer = setTimeout(function() {
      currentPos = currentPos + jumpHeight;
      $(".hero").css({
        "bottom": currentPos
      })
      jumpUp()
    }, jumpSpeed)
    if (currentPos == newPos) {
      clearTimeout(jumpUpTimer)
      jumpDown()
    }
  }
  jumpUp();

  function jumpDown() {
    var jumpDownTimer = setTimeout(function() {
      currentPos = currentPos - jumpHeight;
      $(".hero").css({
        "bottom": currentPos
      })
      jumpDown();
    }, jumpSpeed)
    if (currentPos == oldPos) {
      clearTimeout(jumpDownTimer);
      jumpPermission = true;
    }
  }
};

hero.moveLeft = function(value) {
  $(".hero").css({
    "left": value
  });
};

hero.collision = {
  x: function() {
    return hero.left() == enemy.left() + enemysLeft - enemy.width();
  },
  y: function() {
    return hero.top() + hero.height() > enemy.top();
  }
};

function resetGame() {
  enemysLeft = 0;
  $(".enemys").css({
    "left": enemysLeft
  });
  $(".enemys").find(".enemy").removeClass("live").addClass("live")
  gameOver = false;
  startGame();
}

function startGame() {
  enemysLeft = enemysLeft - worldStep;
  var i = setTimeout(function() {
    $(".enemys").css({
      "left": enemysLeft
    })
    startGame();
    collision();
  }, gameSpeed)
  if (gameOver == true) {
    clearTimeout(i);
  }
}

startGame();

function collision() {
  if (hero.collision.x() && hero.collision.y()) {
    console.log("GAME OVER");
    gameOver = true;
  } else {
    if (hero.collision.x()) {
      enemy.destroy();
    }
  }
}

$(document).on("keydown", function(e) {
  if (e.keyCode == 38 && jumpPermission) {
    hero.jump(60);
  }
  if (e.keyCode == 32) {
    resetGame();
  }
});
