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
        <td>The height of the chart</td>
    </tr>
    <tr>
        <td><code>width</code></td>
        <td>number</td>
        <td>null</td>
        <td>The width of the chart.</td>
    </tr>
    <tr>
        <td><code>tension</code></td>
        <td>number</td>
        <td>0.5</td>
        <td>Tension of chart links. This value should be between 0 and 1.</td>
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
            <li><code>source</code>: The source name.</li>
            <li><code>sourceDimension</code>: The source dimension name.</li>
            <li><code>target</code>: The target name.</li>
            <li><code>targetDimension</code>: The target dimension group.</li>
            <li><code>dimension</code>: The path dimension name.</li>
            <li><code>value</code>: The value.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>sort:categories</code></td>
        <td>
        -
        </td>
    </tr>
    </tbody>
</table>
