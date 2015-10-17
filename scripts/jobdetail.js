/**
 * Copyright (C) 2014 yanni4night.com
 * jobdetail.js
 *
 * changelog
 * 2015-10-16[23:47:24]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
define([], function() {

    function parse(html, handler) {
        var ret = null;
        var iframe = document.createElement('iframe');
        try {
            iframe.style.display = 'none';
            iframe.src = 'about:blank';
            document.body.appendChild(iframe);
            doc = iframe.contentWindow.document;
            doc.body.innerHTML = html;
            ret = handler(doc);
        } finally {
            iframe.parentNode.removeChild(iframe);
            return ret;
        }
    }

    /**
     * Load job detail
     * @param  {number}   id Job id
     * @param  {Function} cb
     */
    function loadJd(id, cb) {
        $.get('http://www.lbtoo.com/job/newinfo?id=' + id).done(function(html) {
            parse(html, function(doc) {
                if (doc) {
                    var str = ($('.JobMs1', doc).find('tr:last-child').remove().end())[0].outerHTML;
                    cb(null, str);
                } else {
                    cb(new Error('Unknown error'));
                }
            });
        }).fail(function(jqXhr, error, errText) {
            cb(new Error(errText));
        });
    }

    /**
     * Load company detail
     * @param  {number}   id  Company id
     * @param  {Function} cb
     */
    function loadCd(id, cb) {

        $.get('http://www.lbtoo.com/job/company?id=' + id).done(function(html) {
            parse(html, function(doc) {
                if (doc) {
                    var str = $('.Ly_body .Ly_Box:nth-of-type(2) p', doc).text();
                    cb(null, str);
                } else {
                    cb(new Error('Unknown error'));
                }
            });
        }).fail(function(jqXhr, error, errText) {
            cb(new Error(errText));
        });
    }

    return {
        loadJd: loadJd,
        loadCd: loadCd
    };
});