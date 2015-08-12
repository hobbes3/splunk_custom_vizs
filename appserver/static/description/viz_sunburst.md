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
        <td><code>root_label</code></td>
        <td>string</td>
        <td>null</td>
        <td>The name of the root node (displayed at graph center).</td>
    </tr>
    <tr>
        <td><code>root_color</code></td>
        <td>string</td>
        <td>null</td>
        <td>The color of the root node (displayed at graph center).</td>
    </tr>
    <tr>
        <td><code>category_fields</code></td>
        <td>array</td>
        <td>null (defaults to all fields)</td>
        <td>A list of fields by which to group children of the root node. Each field essintially indicates the group of the next level in the tree. An example of an array is <code>["foo", "bar"]</code>.</td>
    </tr>
    <tr>
        <td><code>value_field</code></td>
        <td>string</td>
        <td>null</td>
        <td>Indicates the field used to determine the size of the radial groups.</td>
    </tr>
    <tr>
        <td><code>color_field</code></td>
        <td>string</td>
        <td>null</td>
        <td>Indicates the field used to determine the colors (the color is set based on this value).</td>
    </tr>
    <tr>
        <td><code>colors</code></td>
        <td>array</td>
        <td>null</td>
        <td>This is an array of object, where each object consist of a value and a color. When the value of <code>color_field</code> matches here then the color is used. The order of the array sets a precedence (first one overrides the rest).</td>
    </tr>
    <tr>
        <td><code>format_label</code></td>
        <td>function</td>
        <td>_.identity</td>
        <td>A custom formatting function for node names. Takes each node name as an input and returns a formatted name.</td>
    </tr>
    <tr>
        <td><code>format_tooltip</code></td>
        <td>function</td>
        <td>"{name}: {value}"</td>
        <td>A custom formatting function for tooltips. Takes each node as an input and returns a formatted tooltip string.</td>
    </tr>
    </tbody>
</table>
