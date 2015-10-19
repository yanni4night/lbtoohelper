/**
 * Copyright (C) 2014 yanni4night.com
 * back.js
 *
 * changelog
 * 2015-10-19[22:26:10]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */


require(['scripts/jobdetail'], function(JobDetail) {

    var lastNofificationId;
    var lastAdded = [];

    var checkingAlarm = chrome.alarms.create('checkingNew', {
        // when: Date.now() + 3e3,
        delayInMinutes: 1,
        periodInMinutes: 15
    });

    function compare(jobs) {
        var lastJobs = JSON.parse(localStorage.getItem('lastJobs'));
        localStorage.setItem('lastJobs', JSON.stringify(jobs));

        if (!lastJobs) {
            return;
        }

        // var removed = [];
        var added = [];
        // var shutdown = [];
        // 
        var lastIds = lastJobs.map(function(job) {
            return job.id;
        });

        jobs.forEach(function(job) {
            if (lastIds.indexOf(job.id) === -1) {
                added.push(job);
            }
        });

        // todo
        /*lastJobs.forEach(function(job){
            if(!jobs.some(function(ljob){
                return ljob.id === job.id;
            })){
                removed.push(job);
            }
        });*/

        if (added.length) {
            if (lastNofificationId) {
                chrome.notifications.clear(lastNofificationId);
            }

            lastAdded = added.slice();

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'favicon.png',
                title: '职位更新',
                message: '有【' + added[0].name + '】等' + added.length + '个新的职位',
                buttons: [{
                    title: '查看'
                }]
            }, function(id) {
                lastNofificationId = id;
            });
        }

    }

    chrome.notifications.onButtonClicked.addListener(function(id, btnId) {
        lastAdded.forEach(function(job) {
            chrome.tabs.create({
                url: 'http://www.lbtoo.com/job/newinfo?id=' + job.id
            });
        });
    });

    chrome.alarms.onAlarm.addListener(function() {
        JobDetail.query({
            alltext: '北京'
        }, function(err, data) {
            if (err) return;
            var jobs = data.obj.list.map(function(job) {
                return {
                    id: job.jobId,
                    name: job.jobName,
                    feed: job.feedBackContent
                };
            });
            compare(jobs);
        });
    });
});