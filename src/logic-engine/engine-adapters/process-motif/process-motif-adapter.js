const ProcessMotifAdaptater = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['processSelectedMotif'], args);
    }
  };

export default ProcessMotifAdaptater;
