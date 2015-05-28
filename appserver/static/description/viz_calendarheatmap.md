<h4>Options</h4>
<table class="table table-striped table-bordered">
    <tbody>
    <tr>
        <td><b>Name</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><code>managerid</code></td>
        <td>string</td>
        <td>null</td>
        <td>The search manager bound to the chart.</td>
    </tr>
    <tr>
        <td><code>domain</code></td>
        <td>string</td>
        <td>"hour"</td>
        <td>The largest unit the heatmap will differentiate by (represented as blocks of squares). Possible values are: hour, day, week, month, year.</td>
    </tr>
    <tr>
        <td><code>subDomain</code></td>
        <td>string</td>
        <td>"min"</td>
        <td>The smaller unit the heatmap differentiates by (represented as squares). Not all values are allowed, depending on the domain. Possible values are: min, x_min, hour, x_hour, day, x_day, week, x_week, month, x_month (x_ variants are used to rotate the reading order to left to right, then top to bottom).</td>
    </tr>
    <tr>
        <td><code>domainLabelFormat</code></td>
        <td>string</td>
        <td>null</td>
        <td>The way dates should be displayed for the heatmap. Not setting it will result in the default setting.</td>
    </tr>
    </tbody>
</table>
<h4>Events</h4>
<table class="table table-striped table-bordered">
    <tbody>
    <tr>
        <td><b>Name</b></td>
        <td><b>Properties</b></td>
    </tr>
    <tr>
        <td><code>click</code></td>
        <td>
        <ul>
            <li><code>date</code>: The timestamp of the clicked cell.</li>
            <li><code>value</code>: The value of the field at that time.</li>
            <li><code>series</code>: The name of the series.</li>
        </ul>
        </td>
    </tr>
    </tbody>
</table>
