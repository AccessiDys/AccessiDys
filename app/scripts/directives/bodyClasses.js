cnedApp.directive('bodyClasses', function() {
    return {
        link: function(scope, element, attrs) {
            var elementClasses = $(element).attr("class").split(' ');
            for (var i = 0; i < elementClasses.length; i++) {
                if (elementClasses[i] == "doc-apercu") {
                    $('body').removeClass('modal-open');
                    $('body').find('.modal-backdrop').remove();
                }
            };
        }
    };
});