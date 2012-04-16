/*
 * View helpers.
 */

module.exports = function(app) {

  app.helpers({

    /*
     * Convert {Boolean} to 'yes' or 'no'.
     *
     * @param {Boolean} boolean: The boolean value.
     *
     * @return string: 'yes' for true, 'no' for false.
     */
    boolYesNo: function(boolean) {
      return boolean ? 'yes' : 'no';
    },

    /*
     * Check whether the current active menu item matches
     * the passed local value for a given <li>.
     *
     * @param string current: The current active item.
     * @param string local: The item being evaluated.
     *
     * @return string: 'active' for match, '' for mismatch.
     */
    activeLi: function(current, local) {
      return (current == local) ? 'active' : '';
    }

  });

};
