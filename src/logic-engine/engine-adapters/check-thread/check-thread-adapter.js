const CheckThreadAdapter = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['checkThread'], args);
    }
  };

export default CheckThreadAdapter;
