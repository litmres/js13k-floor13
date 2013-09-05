function BoundsRendererSystem(layer) {
  IteratingSystem.call(this, [Position, Bounds]);
  this.l = layer;
}

__extend(BoundsRendererSystem, IteratingSystem, {
  a: function onEntityAdded(entity) {
    var bounds = entity.g(Bounds);

    bounds.gfx = new Graphics(function(ctx, color) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,255,0,.5)';
      ctx.strokeRect(0.5, 0.5, bounds.w - 1, bounds.h - 1);
      ctx.closePath();
    });

    this.l.add(bounds.gfx);
  },
  r: function onEntityRemoved(entity) {
    this.l.remove(Pixelwars.c(entity, Bounds).gfx);
  },
  ue: function updateEntity(entity) {
    var position = entity.g(Position);
    var bounds = entity.g(Bounds);

    bounds.gfx.x = bounds.x + position.x | 0;
    bounds.gfx.y = bounds.y + position.y | 0;
  }
});
