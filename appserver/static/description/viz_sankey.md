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
        <td><code>height</code></td>
        <td>string</td>
        <td>null</td>
        <td>The height of the chart</td>
    </tr>
    <tr>
        <td><code>width</code></td>
        <td>string</td>
        <td>null</td>
        <td>The width of the chart.</td>
    </tr>
    <tr>
        <td><code>formatLabel</code></td>
        <td>function</td>
        <td>_.identity</td>
        <td>A custom formatting function for node names. Takes each node name as an input and returns a formatted name.</td>
    </tr>
    <tr>
        <td><code>formatTooltip</code></td>
        <td>function</td>
        <td>"{source} -> {target}: {value}"</td>
        <td>A custom formatting function for path tooltips. Takes each node as an input and returns a formatted tooltip string.</td>
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
        <td><code>click:link</code></td>
        <td>
        <ul>
            <li><code>source</code>: The source node name.</li>
            <li><code>target</code>: The target node name.</li>
            <li><code>value</code>: The node value.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>click:node</code></td>
        <td>
        <ul>
            <li><code>name</code>: The node name.</li>
            <li><code>value</code>: The node value.</li>
            <li><code>incomingLinks</code>: A dictionary of links coming into this node.</li>
            <li><code>outgoingLinks</code>: A dictionary of links going out of this node.</li>
        </ul>
        </td>
    </tr>
    </tbody>
</table>
