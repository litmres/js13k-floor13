(function (game, engine) {
  'use strict';

  var SystemManager = engine.SystemManager;

  game.Pixelwars = {
    init: function(canvas) {
      SystemManager.register(new game.MovementSystem());
      SystemManager.register(new game.RenderingSystem(canvas));
    },
    run: function() {
      SystemManager.start();
    }
  };

})(game, engine);
