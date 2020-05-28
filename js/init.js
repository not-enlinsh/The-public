(function (tool) {
    var initData = {}
    var ofOpenid = ''
    function initSuc(resp) {
        if (resp.data) {
            console.log('initData', resp.data)
            initData = Object.assign({}, resp.data)
            window.localStorage.setItem('openid', initData.user.openid)
        } else {
            console.log('错误')
            $('body').empty().text(resp.error.rawMessage)
        }
    }
    function initErr(err) {
        $('body').empty().text(err)
    }
    function init() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 37.5 + 'px'
        setTimeout(() => {
            $('body').css({
                'visibility': 'visible'
            })
        }, 200);
        var code = tool.getQueryVariable('code')
        var testId = tool.getQueryVariable('testId')
        var localId = window.localStorage.getItem('openid')
        var localCode = window.localStorage.getItem('localCode')
        if (testId) {
            ofOpenid = testId
        } else if (localId) {
            ofOpenid = localId
        }
        if (code) {
            if (code !== localCode) {
                window.localStorage.clear()
                window.localStorage.setItem('localCode', code)
                tool.ajax('/api/v1/init', { ofaCode: code }, initSuc, 'POST', false, initErr)
            } else if (ofOpenid) {
                window.localStorage.clear()
                window.localStorage.setItem('localCode', code)
                tool.ajax('/api/v1/init', { ofOpenid: ofOpenid }, initSuc, 'POST', false, initErr)
            } else if (code === localCode) {
                $('body').empty().text('未登录小程序')
            }
        } else if (ofOpenid) {
            tool.ajax('/api/v1/init', { ofOpenid: ofOpenid }, initSuc, 'POST', false, initErr)
        } else {
            console.log('没有code和openid')
            $('body').empty().text('error!')
        }
        window.initData = initData
    }
    init()
})(window.tool)
