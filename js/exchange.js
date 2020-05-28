(function(tool, initData) {
    var exchangeLock = false
    function exchangeSuc(resp) {
        if (resp && !resp.error) {
            $('.d-password').val("")
            console.log('守护星数量', resp.data.starNumber)
            $('.error').hide()
            var num = '+' + resp.data.starNumber
            $('.info-num').text(num)
            $('.info').show()
            exchangeLock = false
        } else {
            $('.info').hide()
            $('.error-detail').text(resp.error.rawMessage)
            $('.error').show()
            exchangeLock = false
        }
    }
    function pageInit() {
        $('.info').hide()
        $('.error').hide()
        $('.exchange-btn').click(function () {
            if (!exchangeLock && initData.user.objectId) {
                let passCode = $('.d-password').val()
                passCode = tool.escape(passCode)
                passCode = $.trim(passCode)
                console.log(passCode)
                if (passCode) {
                    exchangeLock = true
                    console.log('点击兑换按钮', passCode)
                    try {
                        $('.info').hide()
                        $('.error').hide()
                        tool.ajax('/api/v1/user/cash', {
                            userId: initData.user.objectId,
                            code: passCode
                        }, exchangeSuc, 'POST', false, function (err) {
                            $('.error-detail').text(err)
                            $('.error').show()
                            exchangeLock = false
                        })
                    } catch (err) {
                        $('.error-detail').text(err)
                        $('.error').show()
                        exchangeLock = false
                    }
                }
            }
        })
    }
    pageInit()
})(window.tool, window.initData)
