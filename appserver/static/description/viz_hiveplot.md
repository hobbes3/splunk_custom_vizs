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
        <code>src_field</code>
        </td>
        <td>string</td>
        <td>"src"</td>
        <td>The name of the source field.</td>
    </tr>
    <tr>
        <td>
        <code>src_category_field</code>
        </td>
        <td>string</td>
        <td>"src_category"</td>
        <td>The name of the property field. The category determines which line the node will be on.</td>
    </tr>
    <tr>
        <td>
        <code>src_value_field</code>
        </td>
        <td>string</td>
        <td>"src_value"</td>
        <td>The name of the value field for the source. The value determines the node's distance from the center on one of the lines.</td>
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
        <code>dst_category_field</code>
        </td>
        <td>string</td>
        <td>"dst_category"</td>
        <td>The name of the category field for the destination.</td>
    </tr>
    <tr>
        <td>
        <code>dst_value_field</code>
        </td>
        <td>string</td>
        <td>"dst_value"</td>
        <td>The name of the value field for the destination.</td>
    </tr>
    <tr>
        <td>
        <code>category_value</code>
        </td>
        <td>array</td>
        <td>null</td>
        <td>A hardcoded array of some or all category and its order. The first element will be the 12 o'clock axis and the order will go clockwise. Non-matching category element will be ignored.</td>
    </tr>
    <tr>
        <td>
        <code>links_name</code>
        </td>
        <td>string</td>
        <td>"links"</td>
        <td>The name of the links for the status. For example, by default the status will say something like "Showing 23 links among 4 nodes".</td>
    </tr>
    <tr>
        <td>
        <code>nodes_name</code>
        </td>
        <td>string</td>
        <td>"nodes"</td>
        <td>The name of the nodes for the status.</td>
    </tr>
    <tr>
        <td>
        <code>node_name</code>
        </td>
        <td>string</td>
        <td>"Node"</td>
        <td>The label of the node name for the status when hovering over a node. For example, by default the status will say something like "Node: Foo, Category: Bar, Value: 42".</td>
    </tr>
    <tr>
        <td>
        <code>category_name</code>
        </td>
        <td>string</td>
        <td>"Category"</td>
        <td>The label of the category name for the status when hovering over a node.</td>
    </tr>
    <tr>
        <td>
        <code>value_name</code>
        </td>
        <td>string</td>
        <td>"Value"</td>
        <td>The label of the value name for the status when hovering over a node.</td>
    </tr>
    <tr>
        <td>
        <code>labels</code>
        </td>
        <td>bool</td>
        <td>true</td>
        <td>Whether to show labels on the nodes or not.</td>
    </tr>
    </tbody>
</table>
