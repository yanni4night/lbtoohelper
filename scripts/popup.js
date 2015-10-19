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
require(['scripts/jobdetail'], function(JobDetail) {

    function showResult() {
        chrome.tabs.create({
            url: 'query.html'
        })
    }

    $('.last').click(showResult);

    $('form').submit(function(e) {
        e.preventDefault();

        JobDetail.query($(this).serialize(), function(err, data) {
            if (err) {
                chrome.tabs.create({
                    url: 'http://www.lbtoo.com/user/login_form'
                });
            } else {
                localStorage.jobs = JSON.stringify(data.obj);
                showResult();
            }
        });

    });

});