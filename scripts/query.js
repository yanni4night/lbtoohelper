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
require(['lib/underscore'], function() {

    var gComs = [];

    function show(jobs) {

        if (!jobs || !jobs.list || 0 === jobs.list.length || !Array.isArray(jobs.list)) {
            return;
        }

        //gComs = {};
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

    function JobsLoader($tr){
        if('true' === $tr.attr('is-loading')){
            return;
        }

        $tr.attr('is-loading', 'true');

        var comName = $tr.data('com-name');

        var com = (gComs.filter(function(com){
            return comName === com.name;
        })||[])[0];

        if(com){
            var jobsHTML = _.template($('#tpl-job').html())({jobs:com.jobs});
            $(jobsHTML).insertAfter($tr);
            $tr.removeClass('notloaded');
        }

        $tr.removeAttr('is-loading');
    }

    $(document).delegate('#coms-list tr.com-item.notloaded', 'click', function() {
        new JobsLoader($(this));
    });

    show(JSON.parse(localStorage.jobs));
});