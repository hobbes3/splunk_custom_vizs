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
        <td>The height of the chart.</td>
    </tr>
    <tr>
        <td>
        <code>lat_field</code>
        </td>
        <td>string</td>
        <td>"latitude"</td>
        <td>The name of the latitude field.</td>
    </tr>
    <tr>
        <td>
        <code>lon_field</code>
        </td>
        <td>string</td>
        <td>"longitude"</td>
        <td>The name of the longitude field.</td>
    </tr>
    <tr>
        <td>
        <code>group_by_field</code>
        </td>
        <td>string</td>
        <td>null</td>
        <td>An optional third field that groups the data. Leave it null if there are no groupings. Ungrouped fields will show a gradient of color depending of the magnitude. Grouped data will be colored by groups.</td>
    </tr>
    <tr>
        <td>
        <code>spin_speed</code>
        </td>
        <td>number</td>
        <td>0</td>
        <td>The speed to auto-spin the globe. 0 means no auto-spin. A negative number means the earth spins in the opposite direction (as opposed to in reality).</td>
    </tr>
    <tr>
        <td>
        <code>world_image_path</code>
        </td>
        <td>string</td>
        <td>"app/custom_vizs/globe/world_black.jpg"</td>
        <td>The world image file to use for the globe. There are 3 provided maps: "world_black.jpg", "world_nature.jpg", and "world_night.jpg". Or inlcude your own image.</td>
    </tr>
    <tr>
        <td>
        <code>star_field</code>
        </td>
        <td>bool</td>
        <td>true</td>
        <td>Controls whether to show the star field in the background or not.</td>
    </tr>
    </tbody>
</table>
