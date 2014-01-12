cnedApp.directive('showtab', function() {
    return {
        link: function(scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
                $('.sub-menus').hide();
                console.log($(element).attr('href').replace('#',''));
                var currentTab = $(element).attr('href').replace('#','');
                $('#' + currentTab).show();
                console.log($('#' + currentTab));
                // $(element).tab('show');
            });
        }
    };
});