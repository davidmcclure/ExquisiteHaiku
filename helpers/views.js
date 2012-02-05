/*
 * View helpers.
 */

// Boot hook.
exports.boot = function(app) {
    registerHelpers(app);
}

// Define methods.
function registerHelpers(app) {

    app.helpers({

        boolYesNo: function(boolean) {
            return boolean ? 'yes' : 'no';
        },

        activeLi: function(current, local) {
            return (current == local) ? 'active' : '';
        }

    });

}
