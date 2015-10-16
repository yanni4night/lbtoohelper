/**
 * Copyright (C) 2014 yanni4night.com
 * query.js
 *
 * changelog
 * 2015-10-16[21:25:06]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
require(['scripts/jobdetail', 'lib/underscore'], function(JobDetail) {

    var gComs = [];

    function show(jobs) {

        if (!jobs || !jobs.list || 0 === jobs.list.length || !Array.isArray(jobs.list)) {
            return;
        }

        var coms = {};
        jobs.list.forEach(function(job) {
            if (!coms[job.comName]) {
                gComs.push({
                    name: job.comName,
                    avatar: job.comLogo,
                    comIndustry: job.comIndustry,
                    comFinancing: job.comFinancing,
                    jobs: coms[job.comName] = []
                });
            }
            coms[job.comName].push(job);
        });

        var comsListHTML = _.template($('#tpl-com').html())({
            coms: gComs
        });

        $('#coms-list').html(comsListHTML);
    }

    function JobsLoader($tr) {
        if ('true' === $tr.attr('is-loading')) {
            return;
        }

        $tr.attr('is-loading', 'true');

        var comName = $tr.data('com-name');

        var com = (gComs.filter(function(com) {
            return comName === com.name;
        }) || [])[0];

        if (com) {
            var jobsHTML = _.template($('#tpl-job').html())({
                jobs: com.jobs
            });
            $(jobsHTML).insertAfter($tr);
            $tr.removeClass('notloaded');
        }

        $tr.removeAttr('is-loading');
    }

    function JdLoader($tr) {
        if ('true' === $tr.attr('is-loading')) {
            return;
        }

        $tr.attr('is-loading', 'true');

        var jobId = $tr.data('job-id');

        JobDetail.loadJd(jobId, function(err, html) {

            if (!err && html) {
                var jdHTML = _.template($('#tpl-jd').html())({
                    jd: html
                });
                $(jdHTML).insertAfter($tr);
                $tr.removeClass('notloaded');
            }

            $tr.removeAttr('is-loading');
        });
    }

    $(document).delegate('#coms-list tr.com-item.notloaded', 'click', function() {
        new JobsLoader($(this));
    }).delegate('#coms-list tr.job-item.notloaded', 'click', function() {
        new JdLoader($(this));
    });

    $('.loadall').click(function() {
        //sync
        $('#coms-list tr.com-item.notloaded').each(function(idx, tr) {
            new JobsLoader($(tr));
        });
        //async
        $('#coms-list tr.job-item.notloaded').each(function(idx, tr) {
            new JdLoader($(tr));
        });
    });

    show(JSON.parse(localStorage.jobs));
});