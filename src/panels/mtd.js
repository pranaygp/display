var React = require('react');
var $ = require('jquery');
var classNames = require('classnames');

var secrets = require('../secrets');

var apiUrl = 'https://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop';

/**
 * MTD bus times panel.
 */
var MTDPanel = React.createClass({
    getInitialState: function() {
        return {
            departures: []
        };
    },

    updateDepartures: function() {
        var params = $.param({stop_id: 'GWNMN', key: secrets.mtdApiKey});
        var url = apiUrl + '?' + params;
        $.get(url, function(data) {
            this.setState({departures: data.departures});
        }.bind(this));
    },

    componentDidMount: function() {
        // MTD limits requests to once per minute
        this.updateDepartures();
        setInterval(this.updateDepartures, 60000);
    },

    getMinsText: function(mins) {
        if (mins === 0) {
            return 'due';
        }
        return mins + ' min' + (mins !== 1 ? 's' : '');
    },

    render: function() {
        var departures = this.state.departures.slice(0, 5);

        var body;
        if (departures.length > 0) {
            body = departures.map(function(departure) {
                var headsign = departure.headsign.split(' ');
                var num = headsign[0];
                var name = headsign.slice(1).join(' ');
                var mins = departure.expected_mins;
                return <div className="bus-item" key={departure.trip.trip_id}>
                    <div className="bus-name">
                        <strong>{num}</strong> <small>{name}</small>
                    </div>
                    <div className="bus-mins">{this.getMinsText(mins)}</div>
                </div>;
            }.bind(this));
        } else {
            body = <p>No upcoming departures</p>;
        }

        var bodyClass = classNames({
            'panel-body': true,
            'mtd-body-no-departures': departures.length == 0
        });

        return <div className="panel mtd-panel">
            <div className="panel-heading">
                <h2>MTD - Goodwin &amp; Main</h2>
            </div>
            <div className={bodyClass}>
                {body}
            </div>
        </div>;
    }
});

module.exports = MTDPanel;
