const CanalInitMessagesAdaptater = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(['readMessage', 'chargeMessages', 'addMessageToConversation'], args);
    }
  };

export default CanalInitMessagesAdaptater;
