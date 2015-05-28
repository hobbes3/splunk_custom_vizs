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
        <td>number</td>
        <td>null</td>
        <td>The height of the chart.</td>
    </tr>
    <tr>
        <td><code>width</code></td>
        <td>number</td>
        <td>null</td>
        <td>The width of the chart.</td>
    </tr>
    <tr>
        <td><code>valueField</code></td>
        <td>string</td>
        <td>null (defaults to all)</td>
        <td>The magnitude field in the data. Circles will be sized based on this field. If the field does not exist, circles will be uniform size.</td>
    </tr>
    <tr>
        <td><code>nameField</code></td>
        <td>string</td>
        <td>null</td>
        <td>The field used for labeling circles.</td>
    </tr>
    <tr>
        <td><code>categoryField</code></td>
        <td>string</td>
        <td>null</td>
        <td>The field used for grouping data.</td>
    </tr>
    <!-- Isn't being used?<tr>
        <td><code>formatLabel</code></td>
        <td>string</td>
        <td>"{name} {value}"</td>
        <td>A custom formatting function bubble labels. Takes each node name as an input and returns a formatted name.</td>
    </tr>
    <tr>
        <td><code>formatTooltip</code></td>
        <td>string</td>
        <td>"{name}: {value}"</td>
        <td>A custom formatting function for path tooltips. Takes each node as an input and returns a formatted tooltip string.</td>
    </tr>-->
    </tbody>
</table>
<h4>Events</h4>
<table class="table table-striped table-bordered">
    <tr>
    <td><b>Name</b></td>
    <td><b>Properties</b></td>
    </tr>
    <tr>
    <td><code>click</code></td>
    <td>
        <ul>
        <li><code>name</code>: The name of the clicked bubble.</li>
        <li><code>category</code>: The category name of the clicked bubble.</li>
        <li><code>value</code>: The size value of the clicked bubble.</li>
        </ul>
    </td>
    </tr>
</table>
