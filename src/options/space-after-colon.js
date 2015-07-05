var gonzales = require('../gonzales');

module.exports = {
    name: 'space-after-colon',

    runBefore: 'block-indent',

    syntax: ['css', 'less', 'sass', 'scss'],

    accepts: {
        number: true,
        string: /^[ \t\n]*$/
    },

    /**
     * Processes tree node.
     *
     * @param {node} ast
     */
    process: function(ast) {
        let value = this.value;

        ast.traverseByType('declaration', function(declaration) {
            declaration.eachFor('propertyDelimiter', function(delimiter, i) {
                if (delimiter.syntax === 'sass' && !declaration.get(i - 1))
                  return null;

                // Remove any spaces after colon:
                if (declaration.get(i + 1).is('space'))
                    declaration.remove(i + 1);
                // If the value set in config is not empty, add spaces:
                if (value !== '') {
                    var space = gonzales.createNode({
                        type: 'space',
                        content: value
                    });
                    declaration.insert(i + 1, space);
                }

                return null;
            });
        });
    },

    /**
     * Detects the value of an option at the tree node.
     *
     * @param {node} ast
     */
    detect: function(ast) {
        let detected = [];

        ast.traverseByType('declaration', function(declaration) {
            declaration.eachFor('propertyDelimiter', function(delimiter, i) {
                if (declaration.get(i + 1).is('space')) {
                    detected.push(declaration.get(i + 1).content);
                } else {
                    detected.push('');
                }
            });
        });

        return detected;
    }
};