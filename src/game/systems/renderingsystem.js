function RenderingSystem(layer) {
  IteratingSystem.call(this, Position, Display);
  this.l = layer;
}

__extend(RenderingSystem, IteratingSystem, {
  a: function onEntityAdded(entity) {
    // Add entity to the display list
    this.l.add(entity.g(Display).gfx);
  },
  r: function onEntityRemoved(entity) {
    // Remove entity from the display list
    this.l.remove(entity.g(Display).gfx);
  },
  u: function update(elapsed) {
    IteratingSystem.prototype.u.call(this, elapsed);

    // Sort elements
    this.l._c.sort(function(objA, objB) {
      return objA.y - objB.y;
    });
  },
  ue: function updateEntity(entity, elapsed) {
    var position = entity.g(Position);
    var gfx = entity.g(Display).gfx;

    // Update asset position
    gfx.x = position.x | 0;
    gfx.y = position.y | 0;

    // Update animation
    if (gfx instanceof AnimatedSprite) {
      gfx.advance(elapsed * 1000 | 0);
    }
  }
});