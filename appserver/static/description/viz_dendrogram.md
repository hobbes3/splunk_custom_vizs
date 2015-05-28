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
        <td>"auto" or number</td>
        <td>"auto"</td>
        <td>The height of the chart. "auto" will automatically adjust the height based based on the number of nodes (a minimum of 500 pixesl).</td>
    </tr>
    <tr>
        <td><code>root_label</code></td>
        <td>string</td>
        <td>"no root label set"</td>
        <td>The label of the root node (left-most node).</td>
    </tr>
    <tr>
        <td><code>has_size</code></td>
        <td>bool</td>
        <td>true</td>
        <td>Whether the data has size values, which must be the last column.</td>
    </tr>
    <tr>
        <td><code>node_outline_color</code></td>
        <td>string</td>
        <td>"#d62728"</td>
        <td>The color of a node's circle outline.</td>
    </tr>
    <tr>
        <td><code>node_close_color</code></td>
        <td>string</td>
        <td>"#e7969c"</td>
        <td>The color of a closed node's filled circle.</td>
    </tr>
    <tr>
        <td><code>node_open_color</code></td>
        <td>string</td>
        <td>"#ffffff"</td>
        <td>The color of a open node's filled circle.</td>
    </tr>
    <tr>
        <td><code>label_size_color</code></td>
        <td>string</td>
        <td>"#d62728"</td>
        <td>The color of a node's text label for size.</td>
    </tr>
    <tr>
        <td><code>label_count_color</code></td>
        <td>string</td>
        <td>"#1f77b4"</td>
        <td>The color of a node's text label for count.</td>
    </tr>
    <tr>
        <td><code>initial_open_level</code></td>
        <td>number</td>
        <td>1</td>
        <td>The level ("how deep") to initially open the nodes. "-1" means everything will be initially opened.</td>
    </tr>
    <tr>
        <td><code>margin_left</code></td>
        <td>number</td>
        <td>100</td>
        <td>Adjust this value depending on how long the <code>root_label</code> text is</td>
    </tr>
    <tr>
        <td><code>margin_right</code></td>
        <td>number</td>
        <td>400</td>
        <td>Adjust this value depending on how long the lowest node's text label is</td>
    </tr>
    </tbody>
</table>
