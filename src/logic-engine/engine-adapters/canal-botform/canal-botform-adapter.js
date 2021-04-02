const CanalBotformAdaptater = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['sendMessage'], args);
    }
  };

export default CanalBotformAdaptater;
