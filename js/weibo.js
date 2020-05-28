(function (tool) {
    var initData = {}
    var userId = ''
    var ofOpenid = ''
    var weiboLock = false
    var weiboInitData = {
        weiboProfile: '',
        weiboName: '',
        isFinish: false
    }
    function setWeiboInfo() {
        $('.h-content').empty()
        if (weiboInitData.weiboName && weiboInitData.weiboProfile) {
            var $content = `
            <img src="${weiboInitData.weiboProfile}" class="a-img">
            <div class="nick-name">
                ${weiboInitData.weiboName}
            </div>
            <div class="bind-weibo">
                <div class="weibo-icon">
                    <img src="./img/mission_topic_ic_weibo@2x.png">
                </div>
                <div class="bind-info">
                    已绑定
                </div>
            </div>
            <div class="weibo-tips">
                绑定微博避免链接被冒用
            </div>
    `
            $('.h-content').append($content)
        } else {
            let $content = `
            <img src="./img/star_head_default@2x.png" class="a-img">
            <div class="nick-name">
                未绑定昵称
            </div>
            <div class="bind-weibo">
                <div class="weibo-icon">
                    <img src="./img/mission_topic_ic_weibo@2x.png">
                </div>
                <div class="bind-info">
                    暂未绑定
                </div>
            </div>
            <div class="weibo-tips">
                绑定微博避免链接被冒用
            </div>`
            $('.h-content').append($content)
        }
    }
    function initSuc(resp) {
        if (resp.data) {
            console.log('initData', resp.data)
            initData = Object.assign({}, resp.data)
            // 请求init 缓存并赋值 isfinish
            window.localStorage.setItem('isFinish', initData.weibo.isFinish)
            window.localStorage.setItem('openid', initData.user.openid)
            window.localStorage.setItem('objectId', initData.user.objectId)
            userId = window.localStorage.getItem('objectId')
            weiboInitData.isFinish = JSON.parse(window.localStorage.getItem('isFinish'))
            // 如果有微博信息  缓存并赋值
            if (initData.user.weiboName) {
                weiboInitData.weiboName = initData.user.weiboName
                window.localStorage.setItem('weiboName', initData.user.weiboName)
            } else {
                window.localStorage.setItem('weiboName', '')
            }
            if (initData.user.weiboProfile) {
                weiboInitData.weiboProfile = initData.user.weiboProfile
                window.localStorage.setItem('weiboProfile', initData.user.weiboProfile)
            } else {
                window.localStorage.setItem('weiboProfile', '')
            }
        } else {
            console.log('错误')
            $('body').empty().text(resp.error.rawMessage)
        }
    }
    function linkSuc(resp) {
        if (resp && !resp.error) {
            $('.d-link').val("")
            console.log('微博成功')
            $('.error').hide()
            $('.un-post').hide()
            $('.info').show()
            $('.h-content').empty()
            weiboInitData = {
                weiboProfile: resp.data.user.weiboProfile,
                weiboName: resp.data.user.weiboName,
                isFinish: true
            }
            window.localStorage.removeItem('isFinish')
            window.localStorage.setItem('isFinish', 'true')
            if (weiboInitData.weiboName && weiboInitData.weiboProfile) {
                var $content = `
            <img src="${weiboInitData.weiboProfile}" class="a-img">
            <div class="nick-name">
                ${weiboInitData.weiboName}
            </div>
            <div class="bind-weibo">
                <div class="weibo-icon">
                    <img src="./img/mission_topic_ic_weibo@2x.png">
                </div>
                <div class="bind-info">
                    已绑定
                </div>
            </div>
            <div class="weibo-tips">
                绑定微博避免链接被冒用
            </div>
    `
                $('.h-content').append($content)
            } else {
                let $content = `
            <img src="./img/star_head_default@2x.png" class="a-img">
            <div class="nick-name">
                未绑定昵称
            </div>
            <div class="bind-weibo">
                <div class="weibo-icon">
                    <img src="./img/mission_topic_ic_weibo@2x.png">
                </div>
                <div class="bind-info">
                    暂未绑定
                </div>
            </div>
            <div class="weibo-tips">
                绑定微博避免链接被冒用
            </div>`
                $('.h-content').append($content)
            }
            weiboLock = false
        } else {
            console.log('微博错误提示', resp)
            $('.error').hide()
            $('.error-detail').text(resp.error.rawMessage)
            $('.error').show()
            weiboLock = false
        }
    }
    function weiboBind(resp) {
        console.log('weiboBind', resp)
        if (resp.data) {
            isFinish = JSON.parse(window.localStorage.getItem('isFinish'))
            weiboInitData.isFinish = isFinish
            weiboInitData.weiboName = resp.data.weiboName
            weiboInitData.weiboProfile = resp.data.weiboProfile
            window.localStorage.setItem('weiboName', resp.data.weiboName)
            window.localStorage.setItem('weiboProfile', resp.data.weiboProfile)
        } else {
            console.log('错误')
            $('body').empty().text(`${resp.error.rawMessage}`)
        }
    }
    function initErr(err) {
        $('body').empty().text(err)
    }
    function weiboInit() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / 37.5 + 'px'
        setTimeout(() => {
            $('body').css({
                'visibility': 'visible'
            })
        }, 200);
        var code = tool.getQueryVariable('code')
        var testId = tool.getQueryVariable('testId')
        var type = tool.getQueryVariable('type')
        var localId = window.localStorage.getItem('openid')
        var localCode = window.localStorage.getItem('localCode')
        userId = window.localStorage.getItem('objectId')
        if (testId) {
            ofOpenid = testId
        } else if (localId) {
            ofOpenid = localId
        }
        if (type && type === 'weibo') {
            if (code && userId) {
                tool.ajax('/api/v1/user/weiboBind', {
                    weiboCode: code,
                    userId: userId
                }, weiboBind, 'POST', false)
            } else {
                var file = window.localStorage.getItem('weiboProfile')
                var name = window.localStorage.getItem('weiboName')
                var weiFinish = JSON.parse(window.localStorage.getItem('isFinish'))
                weiboInitData = {
                    weiboProfile: file,
                    weiboName: name,
                    isFinish: weiFinish
                }
            }
        } else {
            if (code) {
                if (ofOpenid) {
                    window.localStorage.clear()
                    window.localStorage.setItem('localCode', code)
                    tool.ajax('/api/v1/init', { ofOpenid: ofOpenid }, initSuc, 'POST', false, initErr)
                } else if (code !== localCode) {
                    window.localStorage.clear()
                    window.localStorage.setItem('localCode', code)
                    tool.ajax('/api/v1/init', { ofaCode: code }, initSuc, 'POST', false, initErr)
                } else if (code === localCode) {
                    $('body').empty().text('未登录小程序')
                }
            } else if (ofOpenid) {
                tool.ajax('/api/v1/init', { ofOpenid: ofOpenid }, initSuc, 'POST', false, initErr)
            } else {
                $('body').empty().text('error!')
            }
        }
    }
    function pageInit() {
        setWeiboInfo()
        if (weiboInitData.isFinish) {
            $('.un-post').hide()
            $('.info').show()
        } else {
            $('.info').hide()
            $('.un-post').show()
        }
        $('.link-btn').click(function () {
            if (!weiboLock) {
                console.log('点击按钮')
                let param = $('.d-link').val()
                param = $.trim(param)
                if (param && userId) {
                    weiboLock = true
                    try {
                        $('.error').hide()
                        tool.ajax('/api/v1/user/task', {
                            userId: userId,
                            type: 'weibo',
                            param: param
                        }, linkSuc, 'POST', false, function (err) {
                            $('.error-detail').text(err)
                            $('.error').show()
                            weiboLock = false
                        })
                    } catch (err) {
                       $('.error-detail').text(err)
                        $('.error').show()
                        weiboLock = false 
                    }
                }
            }
        })
        $('.bind-info').click(function () {
            window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=1345549945&redirect_uri=https://mxsleng.remarkable.cn/weibo.html?type=weibo&response_type=code'
        })
    }
    weiboInit()
    pageInit()
})(window.tool)
