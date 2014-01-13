cnedApp.directive('showtab', function() {
    return {
        link: function(scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();

                $('.sub-menus').hide();
                $('a[showtab]').removeClass("active");
                $(element).addClass('active');

                var currentTab = $(element).attr('href').replace('#', '');
                $('#' + currentTab).show();
            });
        }
    };
});