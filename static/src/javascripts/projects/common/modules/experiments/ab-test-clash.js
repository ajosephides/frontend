define([
    'lodash/collections/some',
    'common/modules/experiments/ab'
], function (
    some,
    ab
) {

    function userIsInAClashingAbTest() {
        return _testABClash(ab.isInVariant);
    }

    function _testABClash(f) {


        var contributionsKong = {name: 'ContributionsKong20160919', variants: ['control', 'kong']};


        var clashingTests = [contributionsKong];

        return some(clashingTests, function (test) {
            return some(test.variants, function (variant) {
                return f(test.name, variant);
            });
        });
    }

    return {
        userIsInAClashingAbTest: userIsInAClashingAbTest,
        _testABClash: _testABClash // exposed for unit testing
    };
});
