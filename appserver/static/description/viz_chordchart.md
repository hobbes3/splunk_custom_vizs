<h4>Options</h4>
<table class="table table-striped table-bordered">
    <tbody>
    <tr>
        <td>
        <b>Name</b>
        </td>
        <td>
        <b>Type</b>
        </td>
        <td>
        <b>Default</b>
        </td>
        <td>
        <b>Description</b>
        </td>
    </tr>
    <tr>
        <td>
        <code>managerid</code>
        </td>
        <td>string</td>
        <td>null</td>
        <td>The search manager bound to the chart.</td>
    </tr>
    <tr>
        <td>
        <code>height</code>
        </td>
        <td>number</td>
        <td>800</td>
        <td>The height of the panel.</td>
    </tr>
    <tr>
        <td>
        <code>src_field</code>
        </td>
        <td>string</td>
        <td>"src"</td>
        <td>The name of the source field.</td>
    </tr>
    <tr>
        <td>
        <code>dst_field</code>
        </td>
        <td>string</td>
        <td>"dst"</td>
        <td>The name of the destination field.</td>
    </tr>
    <tr>
        <td>
        <code>count_field</code>
        </td>
        <td>string</td>
        <td>"count"</td>
        <td>The name of the count field.</td>
    </tr>
    <tr>
        <td>
        <code>colors</code>
        </td>
        <td>string</td>
        <td>"splunk"</td>
        <td>Possible values are "splunk", "d3", and "random". "splunk" uses the default 36 charting colors in Splunk. "d3" uses a shuffled <code>d3.scale.category20()</code>. "random" generate a random color for every field each reload. Both "d3" and "splunk" will re-use colors if necessary.</td>
    </tr>
    <tr>
        <td>
        <code>src_colors</code>
        </td>
        <td>JSON</td>
        <td>null</td>
        <td>Overrides colors for specific <code>src</code> fields. The JSON must have field name as the key with the corresponding hex color as the value: <code>{"foo": "#3e2f12", "bar": "#4d3d00"}</code>
        </td>
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
        <td><code>colors_ready</code></td>
        <td>(When the colors of the chord chart has been all set. Use <code>this.options.src_colors</code>.)</td>
    </tr>
    <tr>
        <td><code>click</code></td>
        <td>
        <ul>
            <li><code>name</code>: The segment name.</li>
        </ul>
        </td>
    </tr>
    </tbody>
</table>
