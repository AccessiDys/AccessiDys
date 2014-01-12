cnedApp.directive('bodyClasses', function() {
    return {
        link: function(scope, element, attrs) {
            console.log("inside body classes =+> ");

            var elementClasses = $(element).attr("class").split(' ');
            console.log(elementClasses);
            for (var i = 0; i < elementClasses.length; i++) {
                if (elementClasses[i] == "doc-apercu") {
                    console.log($('body').attr('class'));
                    $('body').removeClass('modal-open');
                    $('body').find('.modal-backdrop').remove();
                }
            };
            // element.click(function(e) {
            //     e.preventDefault();
            //     $('.sub-menus').hide();
            //     console.log($(element).attr('href').replace('#',''));
            //     var currentTab = $(element).attr('href').replace('#','');
            //     $('#' + currentTab).show();
            //     console.log($('#' + currentTab));
            //     // $(element).tab('show');
            // });
        }
    };
});