define([
    'common/utils/config',
    'common/utils/detect',
    'common/utils/mediator'
], function (
    config,
    detect,
    mediator
) {
    return function () {

        this.id = 'DiscussionPromoteBottomBanner';
        this.start = '2016-09-21';
        this.expiry = '2016-11-03';
        this.author = 'Fabio Crisci';
        this.description = 'Promote comments with a sticky bottom banner';
        this.audience = 0.2;
        this.audienceOffset = 0.4;
        this.successMeasure = 'Users interact more with comments after seeing a banner';
        this.showForSensitive = true;
        this.audienceCriteria = 'Modern browsers, mobile only';
        this.dataLinkNames = '';
        this.idealOutcome = '';

        this.canRun = function () {
            var type = config.page.contentType;
            return 'fetch' in window && 'Promise' in window &&
                window.curlConfig.paths['discussion-frontend-react'] &&
                window.curlConfig.paths['discussion-frontend-preact'] &&
                (type === 'Article' || type === 'LiveBlog') &&
                detect.isBreakpoint({ max: 'tablet' });
        };

        this.variants = [
            {
                id: 'control',
                test: function () {},
                success: function (complete) {
                    if (this.canRun()) {
                        mediator.on('discussion:comments:get-more-replies', complete);
                    }
                }.bind(this)
            },
            {
                id: 'active',
                test: function () {},
                success: function (complete) {
                    if (this.canRun()) {
                        mediator.on('discussion:comments:get-more-replies', complete);
                    }
                }.bind(this)
            }
        ];
    };
});
