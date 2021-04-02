const CanalCategoriesAdapter = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(
        [
          'initCategories',
          'chargeCategories',
          'chargeContent',
          'showContent',
          'frozeConversation',
          'showResultSearch',
          'loadSuggestionFaq',
        ],
        args
      );
    }
  };

export default CanalCategoriesAdapter;
