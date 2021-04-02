const CanalConversationAdapter = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['processMessage'], args);
    }
  };

export default CanalConversationAdapter;
