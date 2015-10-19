/**
 * Copyright (C) 2014 yanni4night.com
 * popup.js
 *
 * changelog
 * 2015-10-16[21:22:42]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
require([], function () {

    function showResult() {
        chrome.tabs.create({
            url: 'query.html'
        })
    }

    $('.last').click(showResult);

    $('form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: 'http://www.lbtoo.com/job/comjoblist',
            type: 'post',
            dataType: 'json',
            data: $(this).serialize()
        }).done(function (data) {
            localStorage.jobs = JSON.stringify(data.obj);
            showResult();
        }).fail(function () {
            chrome.tabs.create({
                url: 'http://www.lbtoo.com/user/login_form'
            });
        });

    });

});