define([], function () {
    var Util = {};

    Util.find = function (map, path) {
        return (map && path.reduce(function (p, n) {
            return typeof(p[n]) !== 'undefined' && p[n];
        }, map));
    };

    Util.fixHTML = function (str) {
        if (!str) { return ''; }
        return str.replace(/[<>&"']/g, function (x) {
            return ({ "<": "&lt;", ">": "&gt", "&": "&amp;", '"': "&#34;", "'": "&#39;" })[x];
        });
    };

    Util.hexToBase64 = function (hex) {
        var hexArray = hex
            .replace(/\r|\n/g, "")
            .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
            .replace(/ +$/, "")
            .split(" ");
        var byteString = String.fromCharCode.apply(null, hexArray);
        return window.btoa(byteString).replace(/\//g, '-').slice(0,-2);
    };

    Util.base64ToHex = function (b64String) {
        var hexArray = [];
        atob(b64String.replace(/-/g, '/')).split("").forEach(function(e){
            var h = e.charCodeAt(0).toString(16);
            if (h.length === 1) { h = "0"+h; }
            hexArray.push(h);
        });
        return hexArray.join("");
    };

    Util.uint8ArrayToHex = function (a) {
        // call slice so Uint8Arrays work as expected
        return Array.prototype.slice.call(a).map(function (e) {
            var n = Number(e & 0xff).toString(16);
            if (n === 'NaN') {
                throw new Error('invalid input resulted in NaN');
            }

            switch (n.length) {
                case 0: return '00'; // just being careful, shouldn't happen
                case 1: return '0' + n;
                case 2: return n;
                default: throw new Error('unexpected value');
            }
        }).join('');
    };

    Util.deduplicateString = function (array) {
        var a = array.slice();
        for(var i=0; i<a.length; i++) {
            for(var j=i+1; j<a.length; j++) {
                if(a[i] === a[j]) { a.splice(j--, 1); }
            }
        }
        return a;
    };

    Util.getHash = function () {
        return window.location.hash.slice(1);
    };

    Util.replaceHash = function (hash) {
        if (window.history && window.history.replaceState) {
            if (!/^#/.test(hash)) { hash = '#' + hash; }
            return void window.history.replaceState({}, window.document.title, hash);
        }
        window.location.hash = hash;
    };

    /*
     *  Saving files
     */
    Util.fixFileName = function (filename) {
        return filename.replace(/ /g, '-').replace(/[\/\?]/g, '_')
            .replace(/_+/g, '_');
    };

    Util.bytesToMegabytes = function (bytes) {
        return Math.floor((bytes / (1024 * 1024) * 100)) / 100;
    };

    Util.bytesToKilobytes = function (bytes) {
        return Math.floor(bytes / 1024 * 100) / 100;
    };

    return Util;
});
