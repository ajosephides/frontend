define([
    'bean',
    'qwery',
    'common/utils/$',
    'common/utils/template',
    'common/views/svg',
    'common/utils/fastdom-promise',
    'common/utils/mediator',
    'text!common/views/contributions-epic.html',
    'common/utils/robust',
    'inlineSvg!svgs/icon/arrow-right',
    'common/utils/config',
    'common/modules/commercial/commercial-features',
    'common/utils/storage'

], function (bean,
             qwery,
             $,
             template,
             svg,
             fastdom,
             mediator,
             contributionsEpic,
             robust,
             arrowRight,
             config,
             commercialFeatures,
             storage

) {


    return function () {

        this.id = 'ContributionsKong20160919';
        this.start = '2016-09-19';
        this.expiry = '2016-09-29';
        this.author = 'Jonathan Rankin';
        this.description = 'Test whether telling the story of the guardian through staggered messages over time results in more contributions than always showing the epic message.';

            this.showForSensitive = false;
        this.audience = 0.05;
        this.audienceOffset = 0.33;
        this.successMeasure = 'Impressions to number of contributions';
        this.audienceCriteria = 'All users';
        this.dataLinkNames = '';
        this.idealOutcome = 'The embed performs at least as good as our previous in-article component tests';
        this.canRun = function () {
            var worksWellWithPageTemplate = (config.page.contentType === 'Article'); // may render badly on other types
            return commercialFeatures.canAskForAContribution && worksWellWithPageTemplate && !obWidgetIsShown();
        };

        function obWidgetIsShown() {
            var $outbrain = $('.js-outbrain-container');
            return $outbrain && $outbrain.length > 0;
        }

        var bottomWriter = function (component) {

            return fastdom.write(function () {
                var a = $('.submeta');
                component.insertBefore(a);
                mediator.emit('contributions-embed:insert', component);
            });

        };


        var completer = function (complete) {
            mediator.on('contributions-embed:insert', function () {
                bean.on(qwery('.js-submit-input')[0], 'click', function (){
                    complete();
                });
            });
        };

        function getComponent(title, p1, p2, linkUrl, kongVariant) {
            return $.create(template(contributionsEpic, {
                linkUrl : linkUrl,
                position: 'bottom',
                title: title,
                p1: p1,
                p2: p2,
                kongVariant: kongVariant
            }));
        }

        var titleControl = 'Since you\'re here ...';
        var p1Control = '... we have a small favour to ask. More people are reading the Guardian than ever. But far fewer are paying for it. And advertising revenues are falling\
                        fast. So you can see why we need to ask for your help. The Guardian\'s independent, investigative journalism takes a lot of time, money and hard work to produce. But we do it because we\
                        believe our perspective matters - because it might well be your perspective, too.';
        var p2Control = 'If everyone who reads our reporting, who likes it, helps to pay for it, our future would be much more secure. You can\
                        give money to the Guardian in less than a minute';
        var linkUrlControl = 'https://contribute.theguardian.com?INTCMP=co_uk_kong_control';

        var titleKong0 = 'Message 1';
        var p1Kong0 = 'test';
        var p2Kong0 = 'test';
        var linkUrlKong0 = 'https://contribute.theguardian.com?INTCMP=co_uk_kong0';

        var titleKong1 = 'Message 2';
        var p1Kong1 = 'test';
        var p2Kong1 = 'test';
        var linkUrlKong1 = 'https://contribute.theguardian.com?INTCMP=co_uk_kong1';

        var titleKong2 = 'Message 3';
        var p1Kong2 = 'test';
        var p2Kong2 = 'test';
        var linkUrlKong2 = 'https://contribute.theguardian.com?INTCMP=co_uk_kong2';



        this.variants = [

            {
                id: 'control',
                test: function () {
                    var component = getComponent(titleControl, p1Control, p2Control, linkUrlControl, 'control');
                    bottomWriter(component);
                },
                success: completer
            },

            {
                id: 'kong',
                test: function () {
                    var messageDuration = 0; //21600 for 6 hours
                    var kongSoakNumber = storage.local.get('gu.kongSoakNumber') || 0;
                    var kongMessageNumber = storage.local.get('gu.kongMessageNumber') || 0;
                    var kongTimeStamp = storage.local.get('gu.kongTimeStamp') || Math.floor(Date.now() / 1000);

                    if(kongSoakNumber == 0){
                        bottomWriter(getComponent(titleKong0, p1Kong0, p2Kong0, linkUrlKong0 + '&kongSoak=1'));
                        storage.local.set('gu.kongSoakNumber', 1);
                        storage.local.set('gu.kongMessageNumber', 0);
                        storage.local.set('gu.kongTimeStamp', Math.floor(Date.now() / 1000));
                    }
                    else {
                        if (Math.floor(Date.now() / 1000) - kongTimeStamp > messageDuration) {
                            storage.local.set('gu.kongTimeStamp', Math.floor(Date.now() / 1000));
                            var nextMessageNumber = (kongMessageNumber + 1) % 3;
                            storage.local.set('gu.kongMessageNumber', nextMessageNumber);
                            if (nextMessageNumber == 0) {
                                storage.local.set('gu.kongSoakNumber', kongSoakNumber + 1);
                            }
                        }


                        var soakAppendUrl = '&kongSoak=' + storage.local.get('gu.kongSoakNumber');
                        switch (storage.local.get('gu.kongMessageNumber')) {
                            case 0:
                                bottomWriter(getComponent(titleKong0, p1Kong0, p2Kong0, linkUrlKong0 + soakAppendUrl, 'kong0'));
                                break;
                            case 1:
                                bottomWriter(getComponent(titleKong1, p1Kong1, p2Kong1, linkUrlKong1 + soakAppendUrl, 'kong1'));
                                break;
                            case 2:
                                bottomWriter(getComponent(titleKong2, p1Kong2, p2Kong2, linkUrlKong2 + soakAppendUrl, 'kong2'));
                                break;
                        }
                    }
                },
                success: completer
            }
        ];
    };
});
