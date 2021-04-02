const CanalInitOrdersAdaptater = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['chargeOrders'], args);
    }
  };

export default CanalInitOrdersAdaptater;
