(function (tool) {
    function pageInit() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 37.5 + 'px'
        var oldParam = ''
        var oldUrl = window.location.href
        if(oldUrl.indexOf('?') !== -1) {
            oldParam = oldUrl.split('?')[1]
        }
        var testUrl = ''
        var newUrl = ''
        $('.url-detail').change(function () {
            if($('.url-detail').val()) {
                testUrl = $('.url-detail').val()
                testUrl = $.trim(testUrl)
                window.localStorage.setItem('testUrl', testUrl)
            }
        })
        $('.btn').click(function () {
            testUrl = window.localStorage.getItem('testUrl')
            if ($('.url-detail').val()) {
                testUrl = $('.url-detail').val()
                testUrl = $.trim(testUrl)
                if(testUrl.indexOf('?') !== -1) {
                    var arr1 = testUrl.split('?')
                    newUrl = arr1[0] + '?' +  oldParam + '&' + arr1[1]
                } else {
                    newUrl = testUrl + '?' + oldParam
                }
                window.location.href = newUrl
            } else if (testUrl) {
                if(testUrl.indexOf('?') !== -1) {
                    var arr = testUrl.split('?')
                    newUrl = arr[0] + '?' +  oldParam + "&" + arr[1]
                } else {
                    newUrl = testUrl + '?' + oldParam
                }
                window.location.href = newUrl
            }
        })
    }
    pageInit()
})(window.tool)
