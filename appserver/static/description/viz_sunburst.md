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
        <td>The height of the chart.</td>
    </tr>
    <tr>
        <td><code>width</code></td>
        <td>string</td>
        <td>null</td>
        <td>The width of the chart.</td>
    </tr>
    <tr>
        <td><code>chartTitle</code></td>
        <td>string</td>
        <td>null</td>
        <td>The name of the root node (displayed at graph center).</td>
    </tr>
    <tr>
        <td><code>categoryFields</code></td>
        <td>string (can be a space-separated list)</td>
        <td>null (defaults to all)</td>
        <td>A list of fields by which to group children of the root node. Each field essintially indicates the group of the next level in the tree.</td>
    </tr>
    <tr>
        <td><code>valueField</code></td>
        <td>string</td>
        <td>null</td>
        <td>Indicates the field used to determine the size of the radial groups.</td>
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
        <td>"{name}: {value}"</td>
        <td>A custom formatting function for tooltips. Takes each node as an input and returns a formatted tooltip string.</td>
    </tr>
    </tbody>
</table>
