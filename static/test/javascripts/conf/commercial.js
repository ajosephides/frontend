module.exports = function (config) {
    var settings = new require('./settings.js')(config);
    settings.files.push(
        { pattern: 'static/test/javascripts/spec/commercial/**/*.spec.js', included: false }
    );
    config.set(settings);
};
