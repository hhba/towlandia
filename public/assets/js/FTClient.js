var FTClient = function(apiKey) {

    var ftClient = {
        apiKey: apiKey
    }

    ftClient.query = function(query, success) {

        var url = this.getUrl(query);

        console.log("Querying " + url + "...");
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function (data) {
                var rows = data['rows'];
                success.call(null, rows);
            }
        });
    }

    ftClient.getUrl = function(query) {
        console.log(this);        //TODO(gb): Remove trace!!!
        var queryStr =
            'SELECT ' + query.fields.join(',') + ' ' +
                'FROM ' + query.table +
                (query.tail ? ' ' + query.tail : '');

        console.log("query= " + queryStr);     //TODO(gb): Remove trace!!!

        var url = ['https://www.googleapis.com/fusiontables/v1/query'];
        url.push('?sql=' + encodeURIComponent(queryStr));
        url.push('&key=' + this.apiKey);
        url.push('&callback=?');

        return url.join('');
    }

    return ftClient;
}