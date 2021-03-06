define([
    'qwery',
    'fastdom',
    'common/modules/navigation/edition-picker',
    'common/modules/navigation/editionalise-menu'
], function (
    qwery,
    fastdom,
    editionPicker,
    editionaliseMenu
) {
    var html = qwery('html')[0];
    var menuItems = qwery('.js-close-nav-list');
    var buttonClickHandlers = {
        'main-menu-toggle': veggieBurgerClickHandler,
        'edition-picker': editionPicker
    };

    function closeAllOtherPrimaryLists(targetItem) {
        menuItems.forEach(function (item) {
            if (item !== targetItem) {
                item.removeAttribute('open');
            }
        });
    }

    function removeOrderingFromLists() {
        var mainListItems = qwery('.js-navigation-item');

        mainListItems.forEach(function (item) {
            item.style.order = '';
        });
    }

    function enhanceToButton() {
        var checkboxes = qwery('.js-enhance-checkbox');
        fastdom.read(function () {
            var buttons = checkboxes.map(function (checkbox) {
                var button = document.createElement('button');
                var checkboxId = checkbox.id;
                var checkboxControls = checkbox.getAttribute('aria-controls');
                var checkboxClasses = Array.prototype.slice.call(checkbox.classList);

                checkboxClasses.forEach(function (c) {
                    button.classList.add(c);
                });
                button.setAttribute('id', checkboxId);
                button.setAttribute('aria-controls', checkboxControls);
                button.setAttribute('aria-expanded', 'false');

                return button;
            });
            fastdom.write(function () {
                buttons.forEach(function (button, index) {
                    var checkbox = checkboxes[index];
                    var eventHandler = buttonClickHandlers[button.id];

                    checkbox.parentNode.replaceChild(button, checkbox);
                    button.addEventListener('click', eventHandler);
                });
            });
        });
    }

    function veggieBurgerClickHandler(event) {
        var button = event.target;
        var mainMenu = qwery('#main-menu')[0];
        var veggieBurgerLink = qwery('.js-change-link')[0];

        function menuIsOpen() {
            return button.getAttribute('aria-expanded') === 'true';
        }

        if (!mainMenu || !veggieBurgerLink) {
            return;
        }
        if (menuIsOpen()) {
            fastdom.write(function () {
                button.setAttribute('aria-expanded', 'false');
                mainMenu.setAttribute('aria-hidden', 'true');
                veggieBurgerLink.classList.remove('new-header__nav__menu-button--open');
                removeOrderingFromLists();

                // Users should be able to scroll again
                html.style.overflow = '';
            });
        } else {
            fastdom.write(function () {
                var firstButton = qwery('.js-navigation-button')[0];

                button.setAttribute('aria-expanded', 'true');
                mainMenu.setAttribute('aria-hidden', 'false');
                veggieBurgerLink.classList.add('new-header__nav__menu-button--open');

                if (firstButton) {
                    firstButton.focus();
                }
                // No targetItem to put in as the parameter. All lists should close.
                closeAllOtherPrimaryLists();
                // Prevents scrolling on the body
                html.style.overflow = 'hidden';
            });
        }
    }

    function moveTargetListToTop(targetListId) {
        menuItems.forEach(function (listItem, index) {

            fastdom.read(function () {
                var itemId = listItem.getAttribute('id');

                if (itemId === targetListId) {
                    fastdom.write(function () {
                        var parent = listItem.parentNode;
                        var menuContainer = qwery('.js-main-menu')[0];

                        // Using flexbox to reorder lists based on what is clicked.
                        parent.style.order = '-' + index;

                        // Make sure when the menu is open, the user is always scrolled to the top
                        menuContainer.scrollTop = 0;
                    });
                }
            });
        });
    }

    function bindMenuItemClickEvents() {
        menuItems.forEach(function (item) {
            item.addEventListener('click', closeAllOtherPrimaryLists.bind(null, item));
        });
    }

    function bindPrimaryItemsClickEvents() {
        var primaryItems = qwery('.js-open-section-in-menu');

        primaryItems.forEach(function (primaryItem) {

            primaryItem.addEventListener('click', function () {
                fastdom.read(function () {
                    var id = primaryItem.getAttribute('aria-controls');
                    var menuToOpen = qwery('#' + id)[0];
                    var menuButton = qwery('.js-navigation-button', menuToOpen)[0];

                    fastdom.write(function () {
                        menuToOpen.setAttribute('open', '');
                        moveTargetListToTop(id);
                        menuButton.focus();
                        // Prevents scrolling on the body
                        html.style.overflow = 'hidden';
                    });
                });
            });
        });
    }

    function init() {
        enhanceToButton();
        bindMenuItemClickEvents();
        bindPrimaryItemsClickEvents();
        editionaliseMenu();
    }

    return init;
});
