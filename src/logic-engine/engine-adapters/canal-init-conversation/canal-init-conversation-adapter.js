const CanalInitConversationAdaptater = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['chargeConversations'], args);
    }
  };

export default CanalInitConversationAdaptater;
