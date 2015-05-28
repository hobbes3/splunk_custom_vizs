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
        <td><code>panAndZoom</code></td>
        <td>bool</td>
        <td>true</td>
        <td>Indicates whether the graph layout is zoomable.</td>
    </tr>
    <tr>
        <td><code>directional</code></td>
        <td>bool</td>
        <td>true</td>
        <td>Indicates whether the graph has directionality (arrows).</td>
    </tr>
    <tr>
        <td><code>charges</code></td>
        <td>number</td>
        <td>-500</td>
        <td>Sets the charge for the physics simulation.</td>
    </tr>
    <tr>
        <td><code>gravity</code></td>
        <td>number</td>
        <td>0.2</td>
        <td>Sets the gravity for the physics simulation. A larger number causes graph nodes to cluster closer together.</td>
    </tr>
    <tr>
        <td><code>linkDistance</code></td>
        <td>number</td>
        <td>15</td>
        <td>Sets the initial link distance for the physics simulation. A larger number pushes the nodes farther apart.</td>
    </tr>
    <tr>
        <td><code>swoop</code></td>
        <td>bool</td>
        <td>false</td>
        <td>Indicates whether to display links as straight or curved lines. When false, graph links are straight lines.</td>
    </tr>
    <tr>
        <td><code>isStatic</code></td>
        <td>bool</td>
        <td>true</td>
        <td>Indicates whether the initial rendering is static or dynamic. When true, the graph initially renders in a still state. When false, the graph is dynamic.</td>
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
            <li><code>sourceGroup</code>: The source node's group.</li>
            <li><code>target</code>: The target node name.</li>
            <li><code>targetGroup</code>: The target node's group.</li>
            <li><code>value</code>: The link value.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>click:node</code></td>
        <td>
        <ul>
            <li><code>name</code>: The node name.</li>
            <li><code>value</code>: The node value.</li>
            <li><code>group</code>: The node group.</li>
        </ul>
        </td>
    </tr>
    </tbody>
</table>
