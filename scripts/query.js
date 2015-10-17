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

    var eventCenter = $({});

    function loadCd() {
        $('#coms-list tr.com-item').each(function(idx, tr) {
            var $tr = $(tr);
            var cid = $tr.data('com-id');
            JobDetail.loadCd(cid, function(err, text) {
                if (!err && text) {
                    $tr.find('.detail').text(text);
                }
            });
        });
    }

    function show(jobs) {

        if (!jobs || !jobs.list || 0 === jobs.list.length || !Array.isArray(jobs.list)) {
            return;
        }

        var coms = {};
        jobs.list.forEach(function(job) {
            if (!coms[job.comName]) {
                gComs.push({
                    name: job.comName,
                    id: job.comId,
                    avatar: job.comLogo,
                    comIndustry: job.comIndustry,
                    comFinancing: job.comFinancing,
                    jobs: coms[job.comName] = []
                });
            }
            coms[job.comName].push(job);
        });

        gComs = gComs.sort(function(prev, next) {
            if (prev.jobs.length > next.jobs.length) {
                return -1;
            } else if (prev.jobs.length < next.jobs.length) {
                return 1;
            } else {
                return 0;
            }
        });

        var comsListHTML = _.template($('#tpl-com').html())({
            coms: gComs
        });

        $('#coms-list').html(comsListHTML);

        loadCd();
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

                eventCenter.trigger('new-jd-loaded');
            }

            $tr.removeAttr('is-loading');
        });
    }

    $(document).delegate('#coms-list tr.job-item.notloaded', 'click', function() {
        new JdLoader($(this));
    });

    var isLoadingAll = false;
    // 加载全部jd
    $('.loadall').click(function() {
        if (isLoadingAll) {
            return
        }

        isLoadingAll = true;

        //async
        $('#coms-list tr.job-item.notloaded').each(function(idx, tr) {
            new JdLoader($(tr));
        });

        $(this).parent().remove();
    });


    // 更新进度
    eventCenter.on('new-jd-loaded', function() {
        var all = $('#coms-list tr.job-item').length;
        var notloaded = $('#coms-list tr.job-item.notloaded').length;
        if (!notloaded) {
            $('.progress').remove();
        } else {
            $('.progress-bar').css('width', (all - notloaded) / all * 100 + '%').text('JD加载数：' + (all - notloaded) + '/' + all);

        }
    });

    show(JSON.parse(localStorage.jobs));
});