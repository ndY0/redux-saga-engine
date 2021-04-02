const StartStopAdapter = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['start', 'stop'], args);
    }
  };

export default StartStopAdapter;
