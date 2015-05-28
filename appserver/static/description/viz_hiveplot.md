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
        <code>dest_field</code>
        </td>
        <td>string</td>
        <td>"dest"</td>
        <td>The name of the destination field.</td>
    </tr>
    <tr>
        <td>
        <code>property_field</code>
        </td>
        <td>string</td>
        <td>"property"</td>
        <td>The name of the property field.</td>
    </tr>
    <tr>
        <td>
        <code>category_field</code>
        </td>
        <td>string</td>
        <td>"category"</td>
        <td>The name of the category field.</td>
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
        <td>The name of the nodes for ths status.</td>
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
