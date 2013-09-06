function KeyboardControlSystem() {
  System.call(this);
  Input.c([37, 38, 39, 40]);
}

__extend(KeyboardControlSystem, System, {
  u: function update(elapsed) {
    var getKey = Input.k;
    var x = y = 0;

    var player = __tm.g(TAG_PLAYER);
    var motion = player.g(Motion);
    var cooldown = player.g(Cooldown);

    if (!cooldown.g('atk')) {
      if (getKey(88)) { // X
        var dash = EntityCreator.dash(player.g(Position));
        cooldown.s('atk', dash.g(Lifetime).t * 3);
      } else {
        if (getKey(37)) { // LEFT
          x = -1;
        } else if (getKey(39)) { // RIGHT
          x = 1;
        }

        if (getKey(38)) { // UP
          y = -1;
        } else if (getKey(40)) { // DOWN
          y = 1;
        }
      }
    }

    var length = Math.sqrt(x * x + y * y);
    if (length) {
      motion.dx = x / length * 60;
      motion.dy = y / length * 60;
    } else {
      motion.dx = motion.dy = 0;
    }
  }
});