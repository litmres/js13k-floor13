/**
 * Convert an array of constructors into an array of component types.
 *
 * @private
 * @param  {Function[]} ctors Component constructors
 * @return {String[]} Component names
 */
function componentsToTypes(ctors) {
  return ctors.map(function(ctor) {
    return ctor.name;
  });
}

/**
 * Manage game entities.
 *
 * @param  {EventManager} eventManager
 */
function EntityManager(eventManager) {
  // Private fields
  var currentId = 0;
  var entities = [];
  var entitiesToComponents = [];
  var componentsToEntities = {};

  // Methods variables
  var result, entitiesComp, entity, component, types, type;

  __mixin(this, {
    /**
     * Create a new entity.
     *
     * @param  {Object[]} components
     * @return {Entity} entity
     */
    e: function create(comps) {
      entities[currentId] = entity = new Entity(currentId);
      entitiesToComponents[currentId++] = [];
      comps && comps.map(entity.a, entity);
      return entity;
    },
    /**
     * Kill the specified entity.
     *
     * @param  {Entity} entity
     */
    k: function kill(entity) {
      entity.clear();
      delete entities[entity.i];
      delete entitiesToComponents[entity.i];
    },
    /**
     * Get entities with specified components.
     *
     * @param  {...} Component constructors
     * @return {Entity[]} entities
     */
    f: function filter() {
      types = componentsToTypes(argumentsToArray(arguments));

      // Retrieve matching entity IDs
      entitiesComp = Object.keys(entitiesToComponents);
      for (i = types.length; i--;) {
        entitiesComp = intersect(entitiesComp, Object.keys(componentsToEntities[types[i]] || []));
      }

      // Retrieve entities
      results = [];
      for (i = entitiesComp.length; i--;) {
        results[i] = entities[entitiesComp[i]];
      }

      return results;
    },
    /**
     * Unregister all entities.
     * Warning: Entities are not killed (no event will be fired).
     */
    c: function clear() {
      entities = [];
      currentId = 0;
    }
  });

  /**
   * The entity class. Cannot be instantiated outside the framework, you must
   * create new entities using EntityManager.
   *
   * @private
   * @param  {int} id
   */
  function Entity(id) {
    this.i = id;

    /**
     * Remove a component from the current entity.
     *
     * @private
     * @param  {Entity} entity
     * @param  {String} type
     */
    function _remove(entity, type) {
      if (component = entitiesToComponents[id][type]) {
        eventManager.e('$r', entity, type, component);
        delete entitiesToComponents[id][type];
        delete componentsToEntities[type][id];
      }
    }

    __mixin(this, {
      /**
       * Add a component to the entity.
       *
       * @param  {Object} component
       */
      a: function add(component) {
        entitiesToComponents[id][type = component.constructor.name] = component;
        componentsToEntities[type] || (componentsToEntities[type] = []);
        componentsToEntities[type][id] = 1;
        eventManager.e('$a', this, type, component);
      },
      /**
       * Remove a component from the entity.
       *
       * @param  {Function} ctor Component constructor
       */
      r: function remove(ctor) {
        _remove(this, ctor.name);
      },
      /**
       * Get a component from the entity.
       *
       * @param  {Function} ctor Component constructor
       * @return {Object} component
       */
      g: function get(ctor) {
        return entitiesToComponents[id][ctor.name];
      },
      /**
       * Check if the entity matches the given components.
       *
       * @private
       * @param  {...} Component types
       * @return {Boolean}
       */
      m: function match() {
        types = componentsToTypes(argumentsToArray(arguments));
        return intersect(Object.keys(entitiesToComponents[id]), types).length == types.length;
      },
      /**
       * Remove all the components of the entity.
       */
      c: function clear() {
        for (type in entitiesToComponents[id]) {
          _remove(this, type);
        }
      }
    });
  }
}
