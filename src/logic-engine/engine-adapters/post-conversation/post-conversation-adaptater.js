const PosConversationAdaptater = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['postConversation', 'retrySendConversation'], args);
    }
  };

export default PosConversationAdaptater;
