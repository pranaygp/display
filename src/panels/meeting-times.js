var React = require('react');
var classNames = require('classnames');

var meetingTimes = require('../data/meeting-times.json');

var ROWS_PER_PAGE = 9;

/**
 * Meeting times panel.
 */
var MeetingTimesPanel = React.createClass({
    getInitialState: function() {
        return {
            index: 0
        };
    },

    nextPage: function() {
        var newIndex = this.state.index + ROWS_PER_PAGE;
        newIndex = newIndex >= meetingTimes.length ? 0 : newIndex;
        this.setState({index: newIndex});
    },

    componentDidMount: function() {
        setInterval(this.nextPage, 10000);
    },

    render: function() {
        var index = this.state.index;
        var pageTimes = meetingTimes.slice(index, index + ROWS_PER_PAGE);
        var items = pageTimes.map(function(meeting) {
            var location = meeting.location ? meeting.location : 'TBA';
            var time = meeting.time ? meeting.time : 'TBA';
            return <tr key={meeting.name}>
                <td>{meeting.name}</td>
                <td>{location}</td>
                <td>{time}</td>
            </tr>;
        });

        var dots = [];
        for (var i = 0; i < meetingTimes.length; i += ROWS_PER_PAGE) {
            var dotClass = classNames({
                dot: true,
                active: i == index
            });
            dots.push(<span key={i} className={dotClass} />);
        }

        return <div className="panel meeting-times-panel">
            <div className="panel-heading">
                <h2>Meeting Times</h2>
            </div>
            <div className="panel-body meeting-times-body">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
                <div className="dot-container">
                    {dots}
                </div>
            </div>
        </div>;
    }
});

module.exports = MeetingTimesPanel;
