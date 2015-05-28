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
        <td><code>startField</code></td>
        <td>string</td>
        <td>null</td>
        <td>The field of your search that represents the start of the transaction.</td>
    </tr>
    <tr>
        <td><code>endField</code></td>
        <td>string</td>
        <td>null</td>
        <td>The field of your search that represents the end of the transaction.</td>
    </tr>
    <tr>
        <td><code>durationField</code></td>
        <td>number</td>
        <td>null</td>
        <td>The field of your search that represents the length of the transaction.</td>
    </tr>
    <tr>
        <td><code>categoryLabel</code></td>
        <td>string</td>
        <td>"Category"</td>
        <td>Label for categories.</td>
    </tr>
    <tr>
        <td><code>categoryField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Field that represents the categories.</td>
    </tr>
    <tr>
        <td><code>categorySearch</code></td>
        <td>string</td>
        <td>null</td>
        <td>Search to seed the list of categories.</td>
    </tr>
    <tr>
        <td><code>categorySort</code></td>
        <td>string</td>
        <td>"true"</td>
        <td>If "true", categories are sorted by category label. If "false", categories are listed in the order they appear in the data returned from the search.</td>
    </tr>
    <tr>
        <td><code>seriesLabel</code></td>
        <td>string</td>
        <td>"Series"</td>
        <td>Label for the series.</td>
    </tr>
    <tr>
        <td><code>seriesField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Field that represents the series.</td>
    </tr>
    <tr>
        <td><code>seriesSort</code></td>
        <td>string</td>
        <td>"true"</td>
        <td>If "true", series are sorted by series label. If "false", series are listed in the order they appear in the data returned from the search.</td>
    </tr>
    <tr>
        <td><code>drilldownField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Field to use for drilldowns (if not specified, drilldown by time).</td>
    </tr>
    <tr>
        <td><code>drilldownSearch</code></td>
        <td>string</td>
        <td>null</td>
        <td>Use this search instead of the automatically-generated drilldown search.</td>
    </tr>
    <tr>
        <td><code>highlightField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Field to use for highlighting when putting the mouse over the data (if not specified, only highlight the series label in the legend).</td>
    </tr>
    <tr>
        <td><code>tokenName</code></td>
        <td>string</td>
        <td>null</td>
        <td>Name of the token emitted when clicking on an element.</td>
    </tr>
    <tr>
        <td><code>tokenField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Field to use for the value of the token.</td>
    </tr>
    <tr>
        <td><code>showLegend</code></td>
        <td>string</td>
        <td>"true"</td>
        <td>If "true", displays the series under the chart as a legend.</td>
    </tr>
    <tr>
        <td><code>compact</code></td>
        <td>string</td>
        <td>"false"</td>
        <td>If "true", makes the bars thinner in order to fit more of them. This is particularly useful when there are many concurrent tasks or categories.</td>
    </tr>
    <tr>
        <td><code>extrasField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Field that represents any extra information you want displayed in the tooltip. This field can be standard text or a JSON object (such as <code>eval extras="{\"Source Type\": \""+sourcetype+"\", \"Host\": \""+host+"\"}"</code>, note the use of double quotes, which must be properly escaped if defined inside the .xml). The keys of the JSON object will be the labels of the values in the tooltip. You can include HTML in the field, but please use this wisely.</td>
    </tr>
    <tr>
        <td><code>timeAxisMode</code></td>
        <td>string</td>
        <td>"SEARCH_RANGE"</td>
        <td>If "DATA_RANGE", the x-axis time range is only from the earliest start time in the data to the latest end time in the data. If "SEARCH_RANGE", the x-axis time range covers from the <code>earliest_time</code> in the search criteria to the <code>latest_time</code> in the search criteria.</td>
    </tr>
    </tbody>
</table>
