const CanalFaqAdapter = superclass =>
  class extends superclass {
    constructor(args) {
      super(args);
      this.registerHandlers(
        [
          'fetchCategoriesFromParent',
          'fetchCategoriesPopular',
          'fetchSearchContents',
          'fetchCategoryContents',
          'loadFaq',
          'faqLoaded',
          'showContent',
        ],
        args
      );
    }
  };

export default CanalFaqAdapter;
